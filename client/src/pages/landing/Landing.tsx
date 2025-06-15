import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureCard } from "@/utils/constant";
import platformImageLight from "@/assets/platform_img_1_light.png";
import platformImageDark from "@/assets/platform_img_1_dark.png";
import { useTheme } from "@/components/provider/theme-provider";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="p-10 md:p-20 lg:p-32 flex flex-col items-center gap-16">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl md:text-7xl lg:text-9xl text-pretty text-primary">
          TaskAI
        </h1>
        <p className="text-xl md:text-3xl lg:text-5xl text-neutral-500">
          Manage your taak like a pro with AI
        </p>
        <Button className="mt-5" onClick={() => navigate("/platform")}>
          Get Started
        </Button>
      </div>

      <div className="w-full border rounded-lg shadow-2xl shadow-primary">
        <img
          src={theme === "dark" ? platformImageDark : platformImageLight}
          className="rounded-lg"
        />
      </div>

      <div className="mt-20 w-full">
        <h2 className="text-4xl">Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
          {FeatureCard.map((feature) => (
            <Card
              key={feature.name}
              className={`h-72 row-span-1 rounded-xl ${feature.bg} `}
            >
              <CardHeader>
                <CardTitle className="text-5xl text-neutral-900">{feature.name}</CardTitle>
              </CardHeader>
              <CardFooter className="text-neutral-950">
                {feature.description}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
