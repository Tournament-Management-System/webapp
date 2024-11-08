/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Venue } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type VenueUpdateFormInputValues = {
    name?: string;
    venueType?: string;
    rooms?: string[];
    address?: string;
};
export declare type VenueUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    venueType?: ValidationFunction<string>;
    rooms?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VenueUpdateFormOverridesProps = {
    VenueUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    venueType?: PrimitiveOverrideProps<TextFieldProps>;
    rooms?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type VenueUpdateFormProps = React.PropsWithChildren<{
    overrides?: VenueUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    venue?: Venue;
    onSubmit?: (fields: VenueUpdateFormInputValues) => VenueUpdateFormInputValues;
    onSuccess?: (fields: VenueUpdateFormInputValues) => void;
    onError?: (fields: VenueUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VenueUpdateFormInputValues) => VenueUpdateFormInputValues;
    onValidate?: VenueUpdateFormValidationValues;
} & React.CSSProperties>;
export default function VenueUpdateForm(props: VenueUpdateFormProps): React.ReactElement;
