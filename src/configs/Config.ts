import {Snack} from "../components/Snack";
import {Grid, Paper, TextField} from "@mui/material";
import {LocalizationProvider, StaticDatePicker} from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import svLocale from "date-fns/locale/sv";
import BookedTimes from "../components/index/bookedTimes/BookedTimes";
import React from "react";

export enum Arkivet {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
}

export enum Nationshuset {
    GH = "GH",
    NH = "NH",
}

export type Building = Arkivet | Nationshuset

export enum LaundryBuilding {
    ARKIVET = "ARKIVET",
    NATIONSHUSET = "NATIONSHUSET",
    NYA = "NYA",
}

abstract class Config {
    readonly timeSlots: string[]
    readonly dryingBoothsMappings: Map<string, number>

    protected constructor(timeSlots: string[], dryingBoothsMappings: Map<string, number>) {
        this.timeSlots = timeSlots
        this.dryingBoothsMappings = dryingBoothsMappings
    }

    public getDryingBooth(inputString: string): number {
        const result = this.dryingBoothsMappings.get(inputString);

        if (!result) {
            throw new Error(`Drying booth not found for string: ${inputString}`);
        }

        return result;
    }
}

export default Config

