const imagekit = require("./imageKitCredentials");

const urlEndpoint = (process.env.urlEndpoint || "").replace(/\/$/, "");

function runImageKit(method, ...args) {
  return new Promise((resolve) => {
    method(...args, (error, result) => {
      if (error) {
        console.error("ImageKit cleanup error:", error);
        resolve(null);
        return;
      }
      resolve(result);
    });
  });
}

function isImageKitUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("ik.imagekit.io");
}

function extractImageKitFilePath(url) {
  if (!isImageKitUrl(url)) return null;

  try {
    const withoutQuery = url.split("?")[0];
    if (urlEndpoint && withoutQuery.startsWith(urlEndpoint)) {
      const filePath = withoutQuery.slice(urlEndpoint.length);
      return filePath.startsWith("/") ? filePath : `/${filePath}`;
    }

    const parsed = new URL(withoutQuery);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;
    return `/${segments.slice(1).join("/")}`;
  } catch {
    return null;
  }
}

async function findFileIdByUrl(url) {
  const filePath = extractImageKitFilePath(url);
  if (!filePath) return null;

  const lastSlash = filePath.lastIndexOf("/");
  const folderPath = lastSlash > 0 ? `${filePath.slice(0, lastSlash)}/` : "/";
  const fileName = filePath.slice(lastSlash + 1);

  const files = await runImageKit(imagekit.listFiles.bind(imagekit), {
    path: folderPath,
    name: fileName,
    limit: 1,
  });

  if (Array.isArray(files) && files.length > 0) {
    return files[0].fileId;
  }

  const searchResults = await runImageKit(imagekit.listFiles.bind(imagekit), {
    searchQuery: `name="${fileName}"`,
    limit: 20,
  });

  if (!Array.isArray(searchResults)) return null;

  const normalizedUrl = url.split("?")[0];
  const match = searchResults.find(
    (file) => file.filePath === filePath || file.url === normalizedUrl
  );
  return match?.fileId || null;
}

async function deleteImageKitFileById(fileId) {
  if (!fileId) return;
  await runImageKit(imagekit.deleteFile.bind(imagekit), fileId);
}

async function deleteImageKitFileByUrl(url) {
  if (!isImageKitUrl(url)) return;
  const fileId = await findFileIdByUrl(url);
  if (fileId) {
    await deleteImageKitFileById(fileId);
  }
}

async function deleteImageKitFiles({ fileIds = [], urls = [] } = {}) {
  const ids = new Set(fileIds.filter(Boolean));

  for (const url of urls) {
    if (!isImageKitUrl(url)) continue;
    const fileId = await findFileIdByUrl(url);
    if (fileId) ids.add(fileId);
  }

  await Promise.all([...ids].map((fileId) => deleteImageKitFileById(fileId)));
}

module.exports = {
  isImageKitUrl,
  deleteImageKitFileById,
  deleteImageKitFileByUrl,
  deleteImageKitFiles,
};
