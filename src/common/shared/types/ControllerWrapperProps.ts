import { FieldValues, ControllerProps } from 'react-hook-form';

export type ControllerWrapperProps<TFieldValues extends FieldValues> = Omit<ControllerProps<TFieldValues>, 'render' | 'control'>