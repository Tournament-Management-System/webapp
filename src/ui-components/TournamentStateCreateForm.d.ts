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
export declare type TournamentStateCreateFormInputValues = {
    tournamentFormatId?: string;
    eventFormatIds?: string[];
    competitors?: string;
    judges?: string;
    rooms?: string;
};
export declare type TournamentStateCreateFormValidationValues = {
    tournamentFormatId?: ValidationFunction<string>;
    eventFormatIds?: ValidationFunction<string>;
    competitors?: ValidationFunction<string>;
    judges?: ValidationFunction<string>;
    rooms?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TournamentStateCreateFormOverridesProps = {
    TournamentStateCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    tournamentFormatId?: PrimitiveOverrideProps<TextFieldProps>;
    eventFormatIds?: PrimitiveOverrideProps<TextFieldProps>;
    competitors?: PrimitiveOverrideProps<TextAreaFieldProps>;
    judges?: PrimitiveOverrideProps<TextAreaFieldProps>;
    rooms?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type TournamentStateCreateFormProps = React.PropsWithChildren<{
    overrides?: TournamentStateCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TournamentStateCreateFormInputValues) => TournamentStateCreateFormInputValues;
    onSuccess?: (fields: TournamentStateCreateFormInputValues) => void;
    onError?: (fields: TournamentStateCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TournamentStateCreateFormInputValues) => TournamentStateCreateFormInputValues;
    onValidate?: TournamentStateCreateFormValidationValues;
} & React.CSSProperties>;
export default function TournamentStateCreateForm(props: TournamentStateCreateFormProps): React.ReactElement;
