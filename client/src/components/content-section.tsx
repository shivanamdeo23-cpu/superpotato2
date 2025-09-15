import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ContentSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  items: Array<{
    title: string;
    description: string;
  }>;
  buttonText: string;
  onButtonClick: () => void;
  buttonVariant?: "default" | "secondary";
}

export default function ContentSection({
  title,
  description,
  imageUrl,
  imageAlt,
  items,
  buttonText,
  onButtonClick,
  buttonVariant = "default"
}: ContentSectionProps) {
  return (
    <Card className="border-neutral-200 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 mb-4">{description}</p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-800">{item.title}</p>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Button 
          onClick={onButtonClick}
          className={`mt-6 w-full py-3 px-4 font-medium transition-colors ${
            buttonVariant === "secondary" 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
