// components/ColorVariantItem.tsx
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ColorVariantItemProps {
  index: number;
  control: any;
  register: any;
  removeColor: () => void;
}

const ColorVariantItem: React.FC<ColorVariantItemProps> = ({
  index,
  control,
  register,
  removeColor,
}) => {
  const { fields: sizeFields, append: addSize, remove: removeSize } =
    useFieldArray({
      control,
      name: `colorVariants.${index}.sizes`,
    });

  return (
    <div className="border p-4 rounded space-y-4">
      <FormField
        control={control}
        name={`colorVariants.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color Name</FormLabel>
            <FormControl>
              <Input placeholder="Color name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {sizeFields.map((size, sizeIndex) => (
        <div key={size.id} className="flex gap-2">
          <Input
            placeholder="Size"
            {...register(`colorVariants.${index}.sizes.${sizeIndex}.name`)}
          />
          <Input
            type="number"
            placeholder="Quantity"
            {...register(`colorVariants.${index}.sizes.${sizeIndex}.quantity`, {
              valueAsNumber: true,
            })}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeSize(sizeIndex)}
          >
            Remove Size
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => addSize({ name: "", quantity: 0 })}
      >
        + Add Size
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={removeColor}
      >
        Remove Color
      </Button>
    </div>
  );
};

export default ColorVariantItem;
