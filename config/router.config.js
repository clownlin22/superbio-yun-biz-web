export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Dashboard/Analysis',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/case',
        name: 'case',
        icon: 'file-text',
        routes: [
          {
            path: '/case/Ediet-Case-Form',
            name: 'ediet',
            component: './case/EdietCaseForm',
            hideInMenu: true,
          },
          {
            path: '/case/form',
            name: 'form',
            component: './case/CaseForm',
          },
          {
            path: '/case/list',
            name: 'list',
            component: './case/CaseList',
          },
          {
            path: '/case/audit',
            name: 'audit',
            component: './case/CaseAudit',
          },
          {
            path: '/case/advanced',
            name: 'advanced',
            component: './case/AdvancedProfile',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/lab',
        name: 'lab',
        icon: 'audit',
        routes: [
          {
            path: '/lab/experiment',
            name: 'experiment',
            component: './Lab/LabExperiment',
          },
          {
            path: '/lab/data',
            name: 'data',
            component: './Lab/LabData',
          },
          {
            path: '/lab/exception',
            name: 'exception',
            component: './Lab/LabException',
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        icon: 'file-word',
        routes: [
          {
            path: '/report/list',
            name: 'list',
            component: './Report/ReportList',
          },
          {
            path: '/report/audit',
            name: 'audit',
            component: './Report/ReportReview',
          },
        ],
      },
      {
        path: '/post',
        name: 'post',
        icon: 'mail',
        routes: [
          {
            path: '/post/list',
            name: 'list',
            component: './Mail/MailList',
          },
        ],
      },
      {
        path: '/finance',
        name: 'finance',
        icon: 'pay-circle',
        routes: [
          {
            path: '/finance/ChargesNotes',
            name: 'ChargesNotes',
            component: './Finance/ChargesNotes',
          },
          {
            path: '/finance/list',
            name: 'list',
            component: './Finance/FinanceList',
          },

          {
            path: '/finance/CaseReview',
            name: 'caseReview',
            component: './Finance/CaseReview',
          },
          {
            path: '/finance/RefundList',
            name: 'refund',
            component: './Finance/RefundList',
          },

        ],
      },

      {
        path: '/stat',
        name: 'stat',
        icon: 'bar-chart',
        hideInMenu: true,
        routes: [
          {
            path: '/stat/case',
            name: 'case',
            component: './Forms/BasicForm',
          },
        ],
      },
      {
        path: '/SpbBase',
        name: 'authcenter',
        icon: 'audit',
        routes: [
          {
            path: '/SpbBase/Attachment/AttachmentList',
            name: 'Attachment',
            component: './SpbBase/Attachment/Attachment',
          },
          {
            path: '/SpbBase/Dict/Dict-list',
            name: 'DictList',
            component: './SpbBase/Dict/DictList',
          },
          {
            path: '/SpbBase/Dict/dict-data-list',
            name: 'DictDataList',
            component: './SpbBase/Dict/DictDataList',
            hideInMenu: true,
          },

          {
            path: '/SpbBase/district/districtList',
            name: 'districtList',
            component: './SpbBase/District/District',
          },
          {
            path: '/SpbBase/Entrust/entrustList',
            name: 'entrustList',
            component: './SpbBase/Entrust/EntrustList',
          },
          {
            path: '/SpbBase/authcenter/authUser',
            name: 'authUser',
            component: './SpbBase/Authcenter/AuthUser',
          },
          {
            path: '/SpbBase/authcenter/department',
            name: 'department',
            component: './SpbBase/Authcenter/Department',
          },
          {
            path: '/SpbBase/authcenter/privilege',
            name: 'privilege',
            component: './SpbBase/Authcenter/Privilege',
          },
          {
            path: '/SpbBase/authcenter/role',
            name: 'role',
            component: './SpbBase/Authcenter/Role',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        hideInMenu: true,
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        hideInMenu: true,
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
