/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type JudgeCreateFormInputValues = {
    name?: string;
};
export declare type JudgeCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JudgeCreateFormOverridesProps = {
    JudgeCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type JudgeCreateFormProps = React.PropsWithChildren<{
    overrides?: JudgeCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: JudgeCreateFormInputValues) => JudgeCreateFormInputValues;
    onSuccess?: (fields: JudgeCreateFormInputValues) => void;
    onError?: (fields: JudgeCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JudgeCreateFormInputValues) => JudgeCreateFormInputValues;
    onValidate?: JudgeCreateFormValidationValues;
} & React.CSSProperties>;
export default function JudgeCreateForm(props: JudgeCreateFormProps): React.ReactElement;
