/**
 * @hidden
 */
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
        this.LAST_MODIFIED = '2021-04-14';
        this.NAMESPACE = 'NEWTON';
        this.VERSION = '1.0.94';
    }
}

/**
 * @hidden
 */
export const config = new Newton();
