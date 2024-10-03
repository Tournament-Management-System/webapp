/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Judge } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type JudgeUpdateFormInputValues = {
    name?: string;
};
export declare type JudgeUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JudgeUpdateFormOverridesProps = {
    JudgeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type JudgeUpdateFormProps = React.PropsWithChildren<{
    overrides?: JudgeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    judge?: Judge;
    onSubmit?: (fields: JudgeUpdateFormInputValues) => JudgeUpdateFormInputValues;
    onSuccess?: (fields: JudgeUpdateFormInputValues) => void;
    onError?: (fields: JudgeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JudgeUpdateFormInputValues) => JudgeUpdateFormInputValues;
    onValidate?: JudgeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function JudgeUpdateForm(props: JudgeUpdateFormProps): React.ReactElement;
