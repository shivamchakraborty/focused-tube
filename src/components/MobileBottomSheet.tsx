import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  zIndex?: number;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  zIndex = 10,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    const sheet = sheetRef.current;
    const content = sheet.querySelector('.mobile-smooth-scroll');
    const isAtTop = !content || content.scrollTop === 0;

    const deltaY = e.touches[0].clientY - startY.current;
    currentY.current = e.touches[0].clientY;

    // Only allow dragging down if we're at the top of the content
    if (deltaY > 0 && isAtTop) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!sheetRef.current) return;

    sheetRef.current.style.transition = 'transform 0.3s ease-out';
    
    const deltaY = currentY.current - startY.current;
    if (deltaY > 100) {
      onClose();
    } else {
      sheetRef.current.style.transform = '';
    }
  };

  return (
    <>
      <div
        className={cn(
          'mobile-bottom-sheet-overlay',
          isOpen ? 'open' : 'closed'
        )}
        onClick={onClose}
        style={{ zIndex: zIndex - 1 }}
      />
      <div
        ref={sheetRef}
        className={cn(
          'mobile-bottom-sheet',
          !isOpen && 'closed'
        )}
        style={{ zIndex }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-drag-handle" />
        <div className="mobile-smooth-scroll overflow-y-auto" style={{ maxHeight: 'calc(85vh - 2rem)' }}>
          {title && (
            <div className="px-4 pb-2 sticky top-0 bg-white z-10 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          )}
          {children}
          <div className="h-16"></div>
        </div>
      </div>
    </>
  );
}