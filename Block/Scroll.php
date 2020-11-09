<?php
/**
 *   @package    BoxLeaf
 *   @author     Daniel Coull <ttechitsolutions@gmail.com>
 *   @copyright  01/01/2020, 16:45.$year Daniel Coull
 *   @version    CVS: $Id:$
 *  @since      File available since Release 1.0.0
 *
 */

namespace BoxLeaf\InfinateScroll\Block;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template\Context;
use Magento\Store\Model\ScopeInterface;

/**
 * Class Scroll
 * @package BoxLeaf\InfinateScroll\Block
 */
class Scroll extends \Magento\Framework\View\Element\Template {

    /**
     * @var ScopeConfigInterface
     */
    protected  $_scopeConfig;
    /**
     * @var Json
     */
    protected  $_serializer;

    /**
     * Scroll constructor.
     * @param Context $context
     * @param ScopeConfigInterface $scopeConfig
     * @param Json $serializer
     * @param array $data
     */
    public function __construct(Context $context,
                                ScopeConfigInterface $scopeConfig,
                                Json $serializer,
                                array $data = []) {


        $this->_scopeConfig = $scopeConfig;
        $this->_serializer = $serializer;
        parent::__construct($context, $data);
    }

    /**
     *
     */
    const XML_PATH_SCROLL = 'infinatescroll/';

    /**
     * @param $field
     * @param null $storeId
     * @return mixed
     */
    public function getConfigValue($field, $storeId = null)
    {
        return $this->_scopeConfig->getValue(
            $field, ScopeInterface::SCOPE_STORE, $storeId
        );
    }

    /**
     * @param $code
     * @param null $storeId
     * @return mixed
     */
    public function getGeneralConfig($code, $storeId = null)
    {

        return $this->getConfigValue(self::XML_PATH_SCROLL .'general/'. $code, $storeId);
    }

    /**
     * Show the status block
     * @return  bool|null
     */
    public function showStatus():? bool {
        return $this->getGeneralConfig('show_end_status');
    }

    /**
     * Is block enabled
     * @return  bool|null
     */
    public function enabled():? bool {
        return $this->getGeneralConfig('enable');
    }

    /**
     * @return bool|null
     */
    public function enableDebug():? bool
    {
        return  $this->getGeneralConfig('debug') ;
    }

    /**
     * @return mixed
     */
    public function getContainer() {
        return $this->getGeneralConfig('product_container_class');
    }

    /**
     * @return mixed
     */
    public function getDisplayType() {
        return $this->getGeneralConfig('display_type');
    }

    /**
     * @return string
     */
    public function getJsonBlock():? string {

        $settings = [];
        $config =[];
        $enable =  $this->enabled();
        $loadOnScroll =  boolval($this->getGeneralConfig('load_on_scroll'));
        $analytics =  boolval($this->getGeneralConfig('analytics_tracking'));
        $nextButton =  $this->getGeneralConfig('next_button_class');
        $hideNav =  boolval($this->getGeneralConfig('hide_navigation'));
        $debug = boolval($this->enableDebug());
        if($hideNav) {
            $navClass = $this->getGeneralConfig('navigation_class');
            $config['hideNav'] = $navClass;
        }else {
            $config['hideNav'] = false;
        }
        $endStatusText = '';
        if(boolval($this->showStatus()))
        {
            $endStatusText = $this->getGeneralConfig('end_status_text');
            $config['status'] = '.page-load-status';
        }else {
            $config['status'] = false;
        }

       $settings =  array_merge($settings, [
            'enabled' => $enable,
            'analytics' => $analytics,
            'status' => boolval($this->showStatus()),
            'text' => $endStatusText,
            'display_type' => $this->getDisplayType()
        ]);

        $config = array_merge($config, [
            'path' => $nextButton,
            'checkLastPage' => $nextButton,
            'loadOnScroll' => $loadOnScroll,
            'debug' => $debug
        ]);

        return $this->_serializer->serialize(['config' => $config, 'settings' => $settings]);
    }
}