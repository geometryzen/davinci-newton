class Newton {
    /**
     * The GitHub URL of the repository.
     */
    GITHUB: string;
    /**
     * The last modification date in YYYY-MM-DD format.
     */
    LAST_MODIFIED: string;
    /**
     * The namespace used for traditional JavaScript module loading.
     */
    NAMESPACE: string;
    /**
     * The semantic version number of this library, i.e., (major.minor.patch) format.
     */
    VERSION: string;

    /**
     * 
     */
    constructor() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
        this.LAST_MODIFIED = '2021-03-12';
        this.NAMESPACE = 'NEWTON';
        this.VERSION = '1.0.30';
    }

    log(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    }

    info(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    }

    warn(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message);
    }

    error(message?: any, ...optionalParams: any[]): void {
        // This should allow us to unit test and run in environments without a console.
        console.error(message);
    }
}

/**
 *
 */
export const config = new Newton();
