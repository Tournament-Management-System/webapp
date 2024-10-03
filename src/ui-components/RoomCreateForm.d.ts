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
export declare type RoomCreateFormInputValues = {
    status?: string;
    venueId?: string;
    competitorEntryIds?: string[];
    judges?: string[];
};
export declare type RoomCreateFormValidationValues = {
    status?: ValidationFunction<string>;
    venueId?: ValidationFunction<string>;
    competitorEntryIds?: ValidationFunction<string>;
    judges?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RoomCreateFormOverridesProps = {
    RoomCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    venueId?: PrimitiveOverrideProps<TextFieldProps>;
    competitorEntryIds?: PrimitiveOverrideProps<TextFieldProps>;
    judges?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RoomCreateFormProps = React.PropsWithChildren<{
    overrides?: RoomCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RoomCreateFormInputValues) => RoomCreateFormInputValues;
    onSuccess?: (fields: RoomCreateFormInputValues) => void;
    onError?: (fields: RoomCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RoomCreateFormInputValues) => RoomCreateFormInputValues;
    onValidate?: RoomCreateFormValidationValues;
} & React.CSSProperties>;
export default function RoomCreateForm(props: RoomCreateFormProps): React.ReactElement;
