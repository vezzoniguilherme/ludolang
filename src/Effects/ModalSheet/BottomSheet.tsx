import { AnimatePresence, motion } from "framer-motion";
import { bottomUpSpringAnimation } from "../BottomUpSpringAnimation.ts";
import type { ReactNode } from "react";

type BottomSheetProps = {
  isFullScreen?: boolean;
  isActive: boolean;
  onClose?: () => void;
  sheetKey?: string | number;
  children: ReactNode;
  bgColor?: string;
};

export function BottomSheet({
  isFullScreen,
  isActive,
  sheetKey,
  onClose,
  children,
  bgColor = "bg-main",
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isActive && (
        isFullScreen ? (
          // Fullscreen: backdrop wrapper + sheet nested inside
          <motion.div
            onClick={onClose}
            className="fixed inset-0 h-full w-full z-40 bg-mainAccent/20"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`absolute inset-x-0 bottom-0 ${bgColor}`}
              key={sheetKey}
              variants={bottomUpSpringAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "bottom center" }}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : (
          // Normal feedback sheet: render directly as fixed — no outer wrapper
          // that could apply CSS transforms and break position:fixed
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={`fixed inset-x-0 bottom-0 z-50 ${bgColor}`}
            key={sheetKey}
            variants={bottomUpSpringAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: "bottom center" }}
          >
            {children}
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
