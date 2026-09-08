<?php
/**
 * CoullWorks Catalog Infinite Scroll for Magento 2.
 *
 * @author    danrcoull <ttechitsolutions@gmail.com>
 * @copyright Copyright (c) 2020-2026 CoullWorks
 * @license   MIT
 * @link      https://github.com/CoullWorks/magento2-catalog-infinite-scroll
 */

declare(strict_types=1);

namespace CoullWorks\CatalogInfiniteScroll\Block;

use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Store\Model\ScopeInterface;

/**
 * Renders the infinite-scroll initialiser for a product/content list.
 *
 * Reads its selectors and options from a widget instance when present,
 * otherwise from the store configuration, so the same block drives the
 * category/search auto-attach and every manually placed widget.
 *
 * @api
 */
class Scroll extends Template
{
    private const XML_PATH = 'catalog_infinite_scroll/general/';

    /**
     * RequireJS alias for the frontend component (see requirejs-config.js).
     */
    private const COMPONENT = 'coullworksCatalogInfiniteScroll';

    /**
     * @param Context $context
     * @param Json $serializer
     * @param array $data
     */
    public function __construct(
        Context $context,
        private readonly Json $serializer,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    /**
     * The container selector(s) this instance attaches to.
     */
    public function getContainerSelector(): string
    {
        return (string) $this->resolve('container_selector', 'product_container_class');
    }

    /**
     * Whether the end-status / loader block should be shown.
     */
    public function isShowStatus(): bool
    {
        return (bool) $this->resolve('show_end_status', 'show_end_status');
    }

    /**
     * Message shown once the last page has loaded.
     */
    public function getEndStatusText(): string
    {
        return (string) $this->resolve('end_status_text', 'end_status_text');
    }

    /**
     * The `text/x-magento-init` payload that boots the component on the container.
     */
    public function getInitJson(): string
    {
        return $this->serializer->serialize([
            $this->getContainerSelector() => [
                self::COMPONENT => $this->getComponentConfig(),
            ],
        ]);
    }

    /**
     * Config + settings passed to the JS component.
     *
     * @return array<string, array<string, mixed>>
     */
    public function getComponentConfig(): array
    {
        $next = (string) $this->resolve('next_button_class', 'next_button_class');
        $showStatus = $this->isShowStatus();
        $hideNav = (bool) $this->resolve('hide_navigation', 'hide_navigation');

        return [
            'config' => [
                'path' => $next,
                'checkLastPage' => $next,
                'container' => $this->getContainerSelector(),
                'append' => (string) $this->resolve('item_selector', 'item_selector'),
                'scrollThreshold' => (int) $this->resolve('scroll_threshold', 'scroll_threshold'),
                'loadOnScroll' => (bool) $this->resolve('load_on_scroll', 'load_on_scroll'),
                'hideNav' => $hideNav ? (string) $this->resolve('navigation_class', 'navigation_class') : false,
                'status' => $showStatus ? '.page-load-status' : false,
                'debug' => (bool) $this->resolve('debug', 'debug'),
            ],
            'settings' => [
                'enabled' => true,
                'analytics' => (bool) $this->resolve('analytics_tracking', 'analytics_tracking'),
                'updateUrl' => (bool) $this->resolve('update_url', 'update_url'),
                'status' => $showStatus,
                'text' => $showStatus ? $this->getEndStatusText() : '',
                'display_type' => (string) $this->resolve('display_type', 'display_type'),
            ],
        ];
    }

    /**
     * Return a widget-instance value when set, otherwise the store config value.
     *
     * @param string $dataKey
     * @param string $configCode
     * @return mixed
     */
    private function resolve(string $dataKey, string $configCode): mixed
    {
        $value = $this->getData($dataKey);
        if ($value !== null && $value !== '') {
            return $value;
        }

        return $this->_scopeConfig->getValue(self::XML_PATH . $configCode, ScopeInterface::SCOPE_STORE);
    }
}
