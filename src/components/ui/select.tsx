import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onChange, onValueChange, placeholder, ...props }, ref) => {
    // 处理同时支持标准 onChange 和自定义 onValueChange
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };

    return (
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// 保持 SelectItem 组件完全简单，就是原生的 option 元素
const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("cursor-default", className)}
    {...props}
  />
));
SelectItem.displayName = "SelectItem";

// 导出组件
export {
  Select,
  SelectItem,
};

// 为了保持 API 兼容性，提供调整后的虚拟组件
interface SelectTriggerProps {
  className?: string;
  id?: string;
  [key: string]: any; // 允许任意额外属性
}

const SelectTrigger: React.FC<SelectTriggerProps> = () => {
  // 这个组件现在实际上不会渲染任何内容，但需要接受原来的属性以避免类型错误
  return null;
};
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
  [key: string]: any; // 允许任意额外属性
}

const SelectValue: React.FC<SelectValueProps> = () => {
  // 这个组件现在实际上不会渲染任何内容，但需要接受原来的属性以避免类型错误
  return null;
};
SelectValue.displayName = "SelectValue";

interface SelectContentProps {
  children: React.ReactNode;
  [key: string]: any; // 允许任意额外属性
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => <>{children}</>;
SelectContent.displayName = "SelectContent";

// 导出兼容性组件
export {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectValue as SelectLabel,
  SelectContent as SelectGroup,
  SelectContent as SelectSeparator,
  SelectContent as SelectScrollDownButton,
  SelectContent as SelectScrollUpButton,
}