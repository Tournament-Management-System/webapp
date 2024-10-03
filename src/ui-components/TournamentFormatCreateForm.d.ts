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
export declare type TournamentFormatCreateFormInputValues = {
    name?: string;
    description?: string;
    startTime?: string;
    eventFee?: number;
    eventFormatIds?: string[];
    venueId?: string;
};
export declare type TournamentFormatCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    startTime?: ValidationFunction<string>;
    eventFee?: ValidationFunction<number>;
    eventFormatIds?: ValidationFunction<string>;
    venueId?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TournamentFormatCreateFormOverridesProps = {
    TournamentFormatCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    eventFee?: PrimitiveOverrideProps<TextFieldProps>;
    eventFormatIds?: PrimitiveOverrideProps<TextFieldProps>;
    venueId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TournamentFormatCreateFormProps = React.PropsWithChildren<{
    overrides?: TournamentFormatCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TournamentFormatCreateFormInputValues) => TournamentFormatCreateFormInputValues;
    onSuccess?: (fields: TournamentFormatCreateFormInputValues) => void;
    onError?: (fields: TournamentFormatCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TournamentFormatCreateFormInputValues) => TournamentFormatCreateFormInputValues;
    onValidate?: TournamentFormatCreateFormValidationValues;
} & React.CSSProperties>;
export default function TournamentFormatCreateForm(props: TournamentFormatCreateFormProps): React.ReactElement;
