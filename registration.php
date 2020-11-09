<?php
/**
 *   @package    BoxLeaf
 *   @author     Daniel Coull <ttechitsolutions@gmail.com>
 *   @copyright  01/01/2020, 16:45.$year Daniel Coull
 *   @version    CVS: $Id:$
 *  @since      File available since Release 1.0.0
 *
 */

use \Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'BoxLeaf_InfinateScroll',
    isset($file) ? realpath(dirname($file)) : __DIR__
);