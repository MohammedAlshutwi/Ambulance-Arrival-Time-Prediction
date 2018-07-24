/**
 * Created by mohammed on 22/8/17.
 * This algorithm was derived form http://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/
 */

var sizeof = require('object-sizeof');

function onSegment(p, q, r)
{
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function orientation(p, q, r)
{
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    val = parseInt(val);

    if (val == 0) return 0; // colinear
    return (val > 0)? 1:2; // clock or counterclock wise
}

function doIntersect(p1, q1, p2, q2)
{
    // Find the four orientations needed for general and
    // special cases
    var o1 = orientation(p1, q1, p2);
    var o2 = orientation(p1, q1, q2);
    var o3 = orientation(p2, q2, p1);
    var o4 = orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

exports.isInside = function (polygon, p)
{
    var n = parseInt(sizeof(polygon)/sizeof(polygon[0]));

    if (n <= 1)
    {
        return false;
    }

    // Create a point for line segment from p to infinite
    var extreme = {x: Number.MAX_VALUE, y: p.y};

    // Count intersections of the above line with sides of polygon
    var count = 0, i = 0;
    do
    {
        if (doIntersect(polygon[i], polygon[(i+1)%n], p, extreme))
        {
            if (onSegment(polygon[i], p, polygon[(i+1)%n])){
                return true;
            }
            count++;
        }
        i = (i + 1)%n;
    } while (i != 0);

    // Return true if count is odd, false otherwise
    if (count&1) {
        return true;
    }
    return false;// Same as (count%2 == 1)
};
