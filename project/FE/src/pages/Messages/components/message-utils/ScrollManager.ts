export const isNearBottom = (container: HTMLDivElement): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = container;
  const scrollBottom = scrollHeight - scrollTop - clientHeight;

  const threshold = 100;
  return scrollBottom < threshold;
};

export const isNearTop = (container: HTMLDivElement): boolean => {
  const threshold = 50;
  return container.scrollTop < threshold;
};

export const scrollToBottom = (container: HTMLDivElement | null): void => {
  if (!container) return;

  container.scrollTop = container.scrollHeight;
};

export const saveScrollPosition = (
  container: HTMLDivElement,
  conversationId: string
): void => {
  if (!container || !conversationId) return;

  localStorage.setItem(
    `scroll_position_${conversationId}`,
    container.scrollTop.toString()
  );
};

export const restoreScrollPosition = (
  container: HTMLDivElement | null,
  conversationId: string
): boolean => {
  if (!container || !conversationId) return false;

  const savedPosition = localStorage.getItem(
    `scroll_position_${conversationId}`
  );

  if (savedPosition) {
    console.log("Restoring scroll position:", savedPosition);
    container.scrollTop = parseInt(savedPosition);

    setTimeout(() => {
      if (container) {
        console.log(
          "Current scroll position after restore:",
          container.scrollTop
        );
      }
    }, 50);

    return true;
  }

  return false;
};

export const adjustScrollAfterLoadingOlder = (
  container: HTMLDivElement,
  previousHeight: number,
  previousScrollPosition: number
): void => {
  if (!container) return;

  const newHeight = container.scrollHeight;
  const heightDifference = newHeight - previousHeight;

  if (heightDifference > 0) {
    container.scrollTop = previousScrollPosition + heightDifference;

    setTimeout(() => {
      if (container) {
        console.log(
          "New scroll position after adjustment:",
          container.scrollTop
        );
      }
    }, 10);
  }
};
