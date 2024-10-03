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
export declare type CompetitorCreateFormInputValues = {
    name?: string;
};
export declare type CompetitorCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CompetitorCreateFormOverridesProps = {
    CompetitorCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CompetitorCreateFormProps = React.PropsWithChildren<{
    overrides?: CompetitorCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CompetitorCreateFormInputValues) => CompetitorCreateFormInputValues;
    onSuccess?: (fields: CompetitorCreateFormInputValues) => void;
    onError?: (fields: CompetitorCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CompetitorCreateFormInputValues) => CompetitorCreateFormInputValues;
    onValidate?: CompetitorCreateFormValidationValues;
} & React.CSSProperties>;
export default function CompetitorCreateForm(props: CompetitorCreateFormProps): React.ReactElement;
