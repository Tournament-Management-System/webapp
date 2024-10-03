/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type EventFormatCreateFormInputValues = {
    awards?: string[];
    rounds?: string[];
    name?: string;
};
export declare type EventFormatCreateFormValidationValues = {
    awards?: ValidationFunction<string>;
    rounds?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EventFormatCreateFormOverridesProps = {
    EventFormatCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    awards?: PrimitiveOverrideProps<TextAreaFieldProps>;
    rounds?: PrimitiveOverrideProps<TextAreaFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EventFormatCreateFormProps = React.PropsWithChildren<{
    overrides?: EventFormatCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: EventFormatCreateFormInputValues) => EventFormatCreateFormInputValues;
    onSuccess?: (fields: EventFormatCreateFormInputValues) => void;
    onError?: (fields: EventFormatCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EventFormatCreateFormInputValues) => EventFormatCreateFormInputValues;
    onValidate?: EventFormatCreateFormValidationValues;
} & React.CSSProperties>;
export default function EventFormatCreateForm(props: EventFormatCreateFormProps): React.ReactElement;
