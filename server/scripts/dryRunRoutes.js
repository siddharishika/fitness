const BASE = process.env.API_BASE || "http://localhost:8080";
const INVALID_ID = "507f1f77bcf86cd799439011";

const results = { pass: [], fail: [], warn: [] };

async function request(method, path, { body, headers = {}, label } = {}) {
  const url = `${BASE}${path}`;
  const opts = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    redirect: "manual",
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data, label: label || `${method} ${path}` };
}

function expect(result, { statuses = [200, 201], note }) {
  const ok = statuses.includes(result.status);
  const entry = {
    route: result.label,
    status: result.status,
    note: note || "",
  };
  if (result.status >= 500) {
    results.fail.push({ ...entry, reason: "Server error (5xx)" });
  } else if (ok) {
    results.pass.push(entry);
  } else {
    results.warn.push({ ...entry, reason: `Expected ${statuses.join("|")}` });
  }
}

function expectAuthBlocked(result) {
  const blocked =
    result.status === 401 ||
    (result.status === 200 &&
      result.data &&
      typeof result.data === "object" &&
      result.data.success === false);
  if (result.status >= 500) {
    results.fail.push({
      route: result.label,
      status: result.status,
      reason: "Server error (5xx)",
    });
  } else if (blocked) {
    results.pass.push({
      route: result.label,
      status: result.status,
      note: "Auth guard responded",
    });
  } else {
    results.warn.push({
      route: result.label,
      status: result.status,
      reason: "Expected auth block (401 or success:false)",
    });
  }
}

async function main() {
  try {
    await fetch(BASE);
  } catch {
    console.error(`Server not reachable at ${BASE}. Start it with: npm start`);
    process.exit(1);
  }

  expect(await request("GET", "/test"), { statuses: [200] });
  expect(await request("GET", "/me"), {
    statuses: [200],
    note: "Unauthenticated /me",
  });

  expect(await request("GET", "/allvideos"), { statuses: [200] });
  expect(await request("GET", "/allvideos/Cardio"), { statuses: [200] });
  expect(await request("GET", "/allprograms"), { statuses: [200] });
  expect(await request("GET", "/allprograms/Beginner"), { statuses: [200] });
  expect(await request("GET", "/allrecipes"), { statuses: [201] });
  expect(await request("GET", "/allrecipes/Breakfast"), { statuses: [200] });

  const videos = await request("GET", "/allvideos");
  const programs = await request("GET", "/allprograms");
  const recipes = await request("GET", "/allrecipes");

  const videoId = videos.data?.data?.[0]?._id || INVALID_ID;
  const programId = programs.data?.data?.[0]?._id || INVALID_ID;
  const recipeId = recipes.data?.data?.[0]?._id || INVALID_ID;

  expect(await request("GET", `/show/${videoId}`), {
    statuses: [200, 404],
    note: videoId === INVALID_ID ? "No videos in DB" : "Show video",
  });
  expect(await request("GET", `/showprogram/${programId}`), {
    statuses: [200, 404, 400],
    note: programId === INVALID_ID ? "No programs in DB" : "Show program",
  });
  expect(await request("GET", `/showrecipe/${recipeId}`), {
    statuses: [200, 404],
    note: recipeId === INVALID_ID ? "No recipes in DB" : "Show recipe",
  });

  expect(await request("POST", "/login", {
    body: { data: { username: "dryrun", password: "invalid" } },
  }), { statuses: [401] });

  expect(await request("POST", "/signup", { body: {} }), { statuses: [400] });

  const protectedGets = [
    "/getall",
    "/getuser",
    "/getlikedvideos",
    "/getlikedprograms",
    "/getlikedrecipes",
    "/getmyrecipes",
    "/getmyprograms",
  ];
  for (const path of protectedGets) {
    expectAuthBlocked(await request("GET", path));
  }

  const protectedPosts = [
    ["/add", {}],
    ["/addrecipe", {}],
    ["/addprogram", {}],
    ["/changerecipelike", {}],
    ["/changevideolike", {}],
    ["/changeprogramlike", {}],
    ["/edit", {}],
    [`/deleterecipe/${INVALID_ID}`, {}],
    [`/deleteprogram/${INVALID_ID}`, {}],
    [`/recipe/addreview/${INVALID_ID}`, { review: "" }],
    [`/program/addreview/${INVALID_ID}`, { review: "" }],
    [`/video/addreview/${INVALID_ID}`, { review: "" }],
  ];
  for (const [path, body] of protectedPosts) {
    expectAuthBlocked(await request("POST", path, { body }));
  }

  expectAuthBlocked(
    await request("DELETE", `/delete/${INVALID_ID}`),
  );
  expectAuthBlocked(
    await request("PATCH", `/recipe/addrating/${INVALID_ID}`, {
      body: { userRating: 5, newRating: 5, newRatingCount: 1 },
    }),
  );
  expectAuthBlocked(
    await request("PATCH", `/program/addrating/${INVALID_ID}`, {
      body: { userRating: 5, newRating: 5, newRatingCount: 1 },
    }),
  );
  expectAuthBlocked(
    await request("PATCH", `/addrating/${INVALID_ID}`, {
      body: { userRating: 5, newRating: 5, newRatingCount: 1 },
    }),
  );
  expectAuthBlocked(await request("DELETE", "/deleteaccount"));
  expectAuthBlocked(await request("PATCH", "/edituser", { body: {} }));

  expect(await request("GET", "/logout"), { statuses: [201, 200] });

  const spa = await request("GET", "/");
  if (spa.status === 200 && typeof spa.data === "string" && spa.data.includes("html")) {
    results.pass.push({ route: "GET / (SPA)", status: 200, note: "Serves index.html" });
  } else if (spa.status >= 500) {
    results.fail.push({ route: "GET / (SPA)", status: spa.status, reason: "Server error" });
  } else {
    results.warn.push({
      route: "GET / (SPA)",
      status: spa.status,
      reason: "Unexpected SPA response",
    });
  }

  console.log("\n=== Route Dry Run Report ===\n");
  console.log(`Base URL: ${BASE}\n`);
  console.log(`PASS: ${results.pass.length}`);
  console.log(`WARN: ${results.warn.length}`);
  console.log(`FAIL: ${results.fail.length}\n`);

  if (results.fail.length) {
    console.log("--- FAILURES ---");
    for (const f of results.fail) {
      console.log(`  [${f.status}] ${f.route} — ${f.reason}`);
    }
    console.log("");
  }

  if (results.warn.length) {
    console.log("--- WARNINGS ---");
    for (const w of results.warn) {
      console.log(`  [${w.status}] ${w.route} — ${w.reason || w.note}`);
    }
    console.log("");
  }

  console.log("--- PASSED (sample) ---");
  for (const p of results.pass.slice(0, 12)) {
    console.log(`  [${p.status}] ${p.route}${p.note ? ` — ${p.note}` : ""}`);
  }
  if (results.pass.length > 12) {
    console.log(`  ... and ${results.pass.length - 12} more`);
  }

  console.log("\n--- Sample data ---");
  console.log(`  Videos in DB: ${videos.data?.data?.length ?? 0}`);
  console.log(`  Programs in DB: ${programs.data?.data?.length ?? 0}`);
  console.log(`  Recipes in DB: ${recipes.data?.data?.length ?? 0}`);

  process.exit(results.fail.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Dry run crashed:", err.message);
  process.exit(1);
});
