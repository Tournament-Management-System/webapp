/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Room } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RoomUpdateFormInputValues = {
    status?: string;
    venueId?: string;
    competitorEntryIds?: string[];
    judges?: string[];
};
export declare type RoomUpdateFormValidationValues = {
    status?: ValidationFunction<string>;
    venueId?: ValidationFunction<string>;
    competitorEntryIds?: ValidationFunction<string>;
    judges?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RoomUpdateFormOverridesProps = {
    RoomUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    venueId?: PrimitiveOverrideProps<TextFieldProps>;
    competitorEntryIds?: PrimitiveOverrideProps<TextFieldProps>;
    judges?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RoomUpdateFormProps = React.PropsWithChildren<{
    overrides?: RoomUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    room?: Room;
    onSubmit?: (fields: RoomUpdateFormInputValues) => RoomUpdateFormInputValues;
    onSuccess?: (fields: RoomUpdateFormInputValues) => void;
    onError?: (fields: RoomUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RoomUpdateFormInputValues) => RoomUpdateFormInputValues;
    onValidate?: RoomUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RoomUpdateForm(props: RoomUpdateFormProps): React.ReactElement;
