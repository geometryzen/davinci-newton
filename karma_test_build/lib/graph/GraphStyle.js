"use strict";
// Copyright 2017-2021 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphStyle = void 0;
/**
 *
 */
var GraphStyle = /** @class */ (function () {
    /**
     *
     */
    function GraphStyle(index_, drawingMode, color_, lineWidth) {
        this.index_ = index_;
        this.drawingMode = drawingMode;
        this.color_ = color_;
        this.lineWidth = lineWidth;
        // Do nothing yet.
    }
    return GraphStyle;
}());
exports.GraphStyle = GraphStyle;
