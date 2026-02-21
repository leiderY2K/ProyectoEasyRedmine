export interface IssueResumen {
    id: number;
    tracker: string;
    subject: string;
}

export function mapToIssueResumen(redmineResponse: any): IssueResumen[] {
    return redmineResponse.issues.map((issue: any) => ({
        id: issue.id,
        tracker: issue.tracker?.name,
        subject: issue.subject
    }));
}

export interface Actividad {
    id: number;
    name: string;
}

export function mapToActividad(redmineResponse: any): Actividad[] {
    return redmineResponse.time_entry_activities.map((act: any) => ({
        id: act.id,
        name: act.name
    }));
}