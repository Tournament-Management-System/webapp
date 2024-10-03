/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { TournamentFormat } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TournamentFormatUpdateFormInputValues = {
    name?: string;
    description?: string;
    startTime?: string;
    eventFee?: number;
    eventFormatIds?: string[];
    venueId?: string;
};
export declare type TournamentFormatUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    startTime?: ValidationFunction<string>;
    eventFee?: ValidationFunction<number>;
    eventFormatIds?: ValidationFunction<string>;
    venueId?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TournamentFormatUpdateFormOverridesProps = {
    TournamentFormatUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    eventFee?: PrimitiveOverrideProps<TextFieldProps>;
    eventFormatIds?: PrimitiveOverrideProps<TextFieldProps>;
    venueId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TournamentFormatUpdateFormProps = React.PropsWithChildren<{
    overrides?: TournamentFormatUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    tournamentFormat?: TournamentFormat;
    onSubmit?: (fields: TournamentFormatUpdateFormInputValues) => TournamentFormatUpdateFormInputValues;
    onSuccess?: (fields: TournamentFormatUpdateFormInputValues) => void;
    onError?: (fields: TournamentFormatUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TournamentFormatUpdateFormInputValues) => TournamentFormatUpdateFormInputValues;
    onValidate?: TournamentFormatUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TournamentFormatUpdateForm(props: TournamentFormatUpdateFormProps): React.ReactElement;
