import { each } from 'lodash';

import { secondsToHis } from '../utils';
import http from '../http';

export default {
    /**
     * Get extra album info (from Last.fm).
     *
     * @param  {Object}    album
     * @param  {?Function} cb
     */
    fetch(album, cb = null) {
        if (album.info) {
            cb && cb();

            return;
        }

        http.get(`album/${album.id}/info`, response => {
            if (response.data) {
                this.merge(album, response.data);
            }

            cb && cb();
        });
    },

    /**
     * Merge the (fetched) info into an album.
     *
     * @param  {Object} album
     * @param  {Object} info
     */
    merge(album, info) {
        // Convert the duration into i:s
        info.tracks && each(info.tracks, track => track.fmtLength = secondsToHis(track.length));

        // If the album cover is not in a nice form, discard.
        if (typeof info.image !== 'string') {
            info.image = null;
        }

        // Set the album cover on the client side to the retrieved image from server.
        if (info.cover) {
            album.cover = info.cover;
        }

        album.info = info;
    },
};
