const generateConfig = () => {
    return {
        source: 'Configuration Service',
        menus: [
            {label: 'menu.home.label', url: '/screen/home', isHome: true},
            {label: 'menu.forms.label', url: 'forms'},
            {
                label: 'menu.module1.label', url: '/screen/module1', children: [
                    { label: 'menu.module1.disabled.label', disabled: true },
                    { label: 'menu.module1.page1.label', url: '/screen/module1/page1' },
                    { label: 'menu.module1.page2.label', url: '/screen/module1/page2' }
                ]
            },
            {
                label: 'menu.module2.label', url: '/screen/module2'
            },
            {
                label: 'module.apiQueue', url: '/screen/api-queue'
            },
            {
                label: 'module.permission.label', children: [
                    { label: 'module.permission.accessible', url: '/permissions/accessible'},
                    { label: 'module.permission.inaccessible', url: '/permissions/inaccessible'}
                ]
            }
        ]
    }
};

module.exports = {
    getConfiguration: generateConfig
};
