import type { Exercise, ExerciseOption } from "../../../Types/Catalog/ExerciseType.ts";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInStagger } from "../../../Effects/FadeInAnimation.ts";

type TranslationExerciseProps = {
  exercise: Exercise;
  addOption: (option: ExerciseOption) => void;
  removeOption: (option: ExerciseOption) => void;
  currentSelectedOptions: ExerciseOption[];
};

export function TranslationExercise({
  exercise,
  currentSelectedOptions,
  addOption,
  removeOption,
}: TranslationExerciseProps) {
  const selectedOption = currentSelectedOptions[0] ?? null;

  const handleOptionClick = (option: ExerciseOption) => {
    if (selectedOption?.id === option.id) {
      // Toggling off the same option
      removeOption(option);
    } else {
      // Replace any existing selection with the new one
      if (selectedOption) removeOption(selectedOption);
      addOption(option);
    }
  };

  return (
    <AnimatePresence>
      <motion.div {...fadeInStagger(0.4)} className="w-full h-full flex flex-col gap-8">
        {/* Prompt */}
        <div className="w-full flex justify-center mt-6">
          <div className="p-4 border border-duoGrayBorder rounded-xl max-w-lg w-full">
            <p className="text-white font-light text-xl text-center">{exercise.prompt}</p>
          </div>
        </div>

        {/* Multiple-choice options */}
        <div className="w-full flex flex-col gap-3">
          {exercise.options.map((option) => {
            const isSelected = selectedOption?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-5 py-4 rounded-2xl border font-light text-lg transition-all
                  active:translate-y-[2px] active:shadow-none
                  ${
                    isSelected
                      ? "bg-mainAlt border-mainAccent text-mainAccent shadow-none"
                      : "bg-transparent border-duoGrayBorder text-white shadow-mainShadow hover:border-white/40"
                  }
                `}
              >
                {option.content}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
