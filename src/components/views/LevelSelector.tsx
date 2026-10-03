import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

export interface LevelSelectorProps {
  id: string;
  title: string;
  options: { value: number; name: string; description: string; example?: ReactNode }[];
  summary: ReactNode;
  ariaLabel: string;
  className: string;
  accentClassName: string;
  currentLevel: number;
  goalLevel: number;
  selfAssessmentLevel?: number;
  onCurrentChange: (value: number) => void;
  onGoalChange: (value: number) => void;
  hideGoal?: boolean;
  comment?: string;
  onCommentChange?: (comment: string) => void;
  expanded?: boolean;
  onToggle?: () => void;
  labels: {
    current: string;
    currentPlus: string;
    goal: string;
    goalPlus: string;
    self: string;
    comments: string;
    commentsPlaceholder: string;
  };
}

export function LevelSelector({
  id,
  title,
  options,
  summary,
  ariaLabel,
  className,
  accentClassName,
  currentLevel,
  goalLevel,
  selfAssessmentLevel = 0,
  onCurrentChange,
  onGoalChange,
  hideGoal = false,
  comment = "",
  onCommentChange,
  expanded,
  onToggle,
  labels,
}: LevelSelectorProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = expanded ?? internalExpanded;
  const cycle = (current: number, value: number) =>
    current === value ? value + 0.5 : current === value + 0.5 ? 0 : value;
  return (
    <div
      className={`rounded-xl border ${className} overflow-hidden`}
      data-testid={`level-vertical-${id}`}
    >
      <button
        type="button"
        data-testid={`level-toggle-${id}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (onToggle) onToggle();
          else setInternalExpanded((previous) => !previous);
        }}
        className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-8 rounded-full ${accentClassName}`} />
          <div className="text-left">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <div className="text-xs space-y-0.5">{summary}</div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2" onClick={(event) => event.stopPropagation()}>
          {options.map((option) => {
            const currentSelected =
              currentLevel === option.value || currentLevel === option.value + 0.5;
            const goalSelected = goalLevel === option.value || goalLevel === option.value + 0.5;
            return (
              <div
                key={option.value}
                className={`p-3 rounded-lg bg-white border transition-all ${
                  currentLevel === option.value
                    ? "border-emerald-400 ring-1 ring-emerald-200"
                    : goalLevel === option.value
                      ? "border-amber-400 ring-1 ring-amber-200"
                      : selfAssessmentLevel === option.value
                        ? "border-purple-400 ring-1 ring-purple-200"
                        : "border-slate-200"
                }`}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">L{option.value}</span>
                      <span className="font-medium text-slate-700">{option.name}</span>
                      {selfAssessmentLevel === option.value && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {labels.self}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    {option.example}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      eventId={`level_selector_current_${id}_L${option.value}`}
                      data-testid={`level-current-${id}-${option.value}`}
                      data-selected={currentSelected ? "true" : "false"}
                      type="button"
                      size="sm"
                      variant={currentSelected ? "default" : "outline"}
                      className={`h-7 px-2 text-xs ${currentSelected ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onCurrentChange(cycle(currentLevel, option.value));
                      }}
                    >
                      {currentLevel === option.value + 0.5 ? labels.currentPlus : labels.current}
                    </Button>
                    {!hideGoal && (
                      <Button
                        eventId={`level_selector_goal_${id}_L${option.value}`}
                        data-testid={`level-goal-${id}-${option.value}`}
                        type="button"
                        size="sm"
                        variant={goalSelected ? "default" : "outline"}
                        className={`h-7 px-2 text-xs ${goalSelected ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onGoalChange(cycle(goalLevel, option.value));
                        }}
                      >
                        {goalLevel === option.value + 0.5 ? labels.goalPlus : labels.goal}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="space-y-1 pt-2">
            <label htmlFor={`level-comment-${id}`} className="text-xs font-semibold text-slate-700">
              {labels.comments}
            </label>
            <textarea
              id={`level-comment-${id}`}
              value={comment}
              onChange={(event) => onCommentChange?.(event.target.value)}
              placeholder={labels.commentsPlaceholder}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
