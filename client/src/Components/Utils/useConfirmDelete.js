import { useCallback, useState } from 'react';

export function useConfirmDelete() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  const requestDelete = useCallback(({ itemLabel, itemName, onConfirm }) => {
    setConfig({ itemLabel, itemName, onConfirm });
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    if (loading) return;
    setShow(false);
    setConfig(null);
  }, [loading]);

  const handleConfirm = useCallback(async () => {
    if (!config?.onConfirm) return;
    setLoading(true);
    try {
      await config.onConfirm();
      setShow(false);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [config]);

  return {
    requestDelete,
    deleteModalProps: {
      show,
      onHide: handleHide,
      onConfirm: handleConfirm,
      itemLabel: config?.itemLabel,
      itemName: config?.itemName,
      loading,
    },
  };
}
