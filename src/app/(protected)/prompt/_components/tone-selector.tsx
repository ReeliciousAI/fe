import { Button } from "@/components/ui/button";

type Tone = {
  id: number;
  name: string;
  description: string;
};

interface IToneSelector {
  toneOptions: Tone[];
  selectedTone: number | null;
  handleToneSelect: (id: number) => void;
}

export default function ToneSelector({
  toneOptions,
  selectedTone,
  handleToneSelect,
}: IToneSelector) {
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {toneOptions.map((tone) => (
        <div
          key={tone.id}
          className={`p-3 rounded-md border ${
            selectedTone === tone.id
              ? "border-primary bg-primary/10"
              : "border-input"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{tone.name}</div>
              <div className="text-sm text-muted-foreground">
                {tone.description}
              </div>
            </div>
            <Button
              variant={selectedTone === tone.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneSelect(tone.id)}
            >
              Select
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
