/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Competitor } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CompetitorUpdateFormInputValues = {
    name?: string;
};
export declare type CompetitorUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CompetitorUpdateFormOverridesProps = {
    CompetitorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CompetitorUpdateFormProps = React.PropsWithChildren<{
    overrides?: CompetitorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    competitor?: Competitor;
    onSubmit?: (fields: CompetitorUpdateFormInputValues) => CompetitorUpdateFormInputValues;
    onSuccess?: (fields: CompetitorUpdateFormInputValues) => void;
    onError?: (fields: CompetitorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CompetitorUpdateFormInputValues) => CompetitorUpdateFormInputValues;
    onValidate?: CompetitorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CompetitorUpdateForm(props: CompetitorUpdateFormProps): React.ReactElement;
