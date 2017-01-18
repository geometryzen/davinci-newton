/**
 * 
 */
export interface DisplayObject {

    /**
     * Sets the z-index which specifies front-to-back ordering of objects;
     * objects with a higher zIndex are drawn over (in front of) objects with a lower zIndex.
     * @return the zIndex of this DisplayObject
     */
    getZIndex(): number;

    /**
     * Sets the z-index which specifies front-to-back ordering of objects;
     * objects with a higher zIndex are drawn over objects with a lower zIndex.
     * Default is zero.
     * @param {number|undefined} zIndex the zIndex of this DisplayObject
     */
    setZIndex(zIndex?: number): void;
}

export default DisplayObject;
