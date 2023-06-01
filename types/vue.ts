import type { AllowedComponentProps, VNodeProps } from 'vue'

export type ComponentProps<TComponent> = TComponent extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<TComponent>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

export type ComponentEmit<TComponent> = TComponent extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<TComponent>['$emit'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never
