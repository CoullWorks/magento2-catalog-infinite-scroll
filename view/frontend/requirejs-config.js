/*
 *   @package    BoxLeaf
 *   @author     Daniel Coull <ttechitsolutions@gmail.com>
 *   @copyright  01/01/2020, 16:45.$year Daniel Coull
 *   @version    CVS: $Id:$
 *  @since      File available since Release 1.0.0
 *
 */

var config = {
    paths: {
        'scroll': "BoxLeaf_InfinateScroll/js/scroll",
        'infinatescroll': "//cdnjs.cloudflare.com/ajax/libs/jquery-infinitescroll/3.0.6/infinite-scroll.pkgd",
        'jquery-bridget': "//cdn.jsdelivr.net/npm/jquery-bridget@2.0.1/jquery-bridget.min",
        'masonry' : "//cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min",
        'isotope' :  "//cdnjs.cloudflare.com/ajax/libs/jquery.isotope/3.0.6/isotope.pkgd.min",
        'packery' : "//cdnjs.cloudflare.com/ajax/libs/packery/2.1.2/packery.pkgd.min",
        'imagesloaded' : "//unpkg.com/imagesloaded@4/imagesloaded.pkgd",
    },
    shim: {
        'infinatescroll': {
            deps: ['jquery']
        }
    }
}