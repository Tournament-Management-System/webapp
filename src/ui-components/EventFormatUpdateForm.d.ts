/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { EventFormat } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type EventFormatUpdateFormInputValues = {
    awards?: string[];
    rounds?: string[];
    name?: string;
};
export declare type EventFormatUpdateFormValidationValues = {
    awards?: ValidationFunction<string>;
    rounds?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EventFormatUpdateFormOverridesProps = {
    EventFormatUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    awards?: PrimitiveOverrideProps<TextAreaFieldProps>;
    rounds?: PrimitiveOverrideProps<TextAreaFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EventFormatUpdateFormProps = React.PropsWithChildren<{
    overrides?: EventFormatUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    eventFormat?: EventFormat;
    onSubmit?: (fields: EventFormatUpdateFormInputValues) => EventFormatUpdateFormInputValues;
    onSuccess?: (fields: EventFormatUpdateFormInputValues) => void;
    onError?: (fields: EventFormatUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EventFormatUpdateFormInputValues) => EventFormatUpdateFormInputValues;
    onValidate?: EventFormatUpdateFormValidationValues;
} & React.CSSProperties>;
export default function EventFormatUpdateForm(props: EventFormatUpdateFormProps): React.ReactElement;
