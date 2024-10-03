/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { TournamentState } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TournamentStateUpdateFormInputValues = {
    tournamentFormatId?: string;
    eventFormatIds?: string[];
    competitors?: string;
    judges?: string;
    rooms?: string;
};
export declare type TournamentStateUpdateFormValidationValues = {
    tournamentFormatId?: ValidationFunction<string>;
    eventFormatIds?: ValidationFunction<string>;
    competitors?: ValidationFunction<string>;
    judges?: ValidationFunction<string>;
    rooms?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TournamentStateUpdateFormOverridesProps = {
    TournamentStateUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    tournamentFormatId?: PrimitiveOverrideProps<TextFieldProps>;
    eventFormatIds?: PrimitiveOverrideProps<TextFieldProps>;
    competitors?: PrimitiveOverrideProps<TextAreaFieldProps>;
    judges?: PrimitiveOverrideProps<TextAreaFieldProps>;
    rooms?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type TournamentStateUpdateFormProps = React.PropsWithChildren<{
    overrides?: TournamentStateUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    tournamentState?: TournamentState;
    onSubmit?: (fields: TournamentStateUpdateFormInputValues) => TournamentStateUpdateFormInputValues;
    onSuccess?: (fields: TournamentStateUpdateFormInputValues) => void;
    onError?: (fields: TournamentStateUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TournamentStateUpdateFormInputValues) => TournamentStateUpdateFormInputValues;
    onValidate?: TournamentStateUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TournamentStateUpdateForm(props: TournamentStateUpdateFormProps): React.ReactElement;
