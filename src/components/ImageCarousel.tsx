import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

const defaultImages = [
  "photo-1721322800607-8c38375eef04",
  "photo-1483058712412-4245e9b90334",
  "photo-1487058792275-0ad4aaf24ca7",
  "photo-1519389950473-47ba0277781c",
];

interface ImageCarouselProps {
  className?: string;
  images?: string[];
}

export function ImageCarousel({ className, images }: ImageCarouselProps) {
  const renderImage = (imageId: string) => {
    if (images) {
      return `${supabase.storage.from('room-images').getPublicUrl(imageId).data.publicUrl}`;
    }
    return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800`;
  };

  const displayImages = images?.length ? images : defaultImages;

  return (
    <Carousel className={className}>
      <CarouselContent>
        {displayImages.map((imageId) => (
          <CarouselItem key={imageId}>
            <img
              src={renderImage(imageId)}
              alt="Room"
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}