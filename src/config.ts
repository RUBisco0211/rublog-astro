import type {
  AnalyticsConfig,
  CommentConfig,
  GithubConfig,
  Link,
  PhotosConfig,
  PostConfig,
  ProjectConfig,
  Site,
  SkillsShowcaseConfig,
  SocialLink,
  TagsConfig,
} from '~/types'

//--- Readme Page Config ---
export const SITE: Site = {
  title: 'RuBlog',
  description: 'RuBlog：RUBisco的个人博客，使用Astro框架与Litos主题构建。',
  website: 'https://github.com/RUBisco0211',
  lang: 'zh-CN',
  base: '/',
  author: 'RUBisco',
  ogImage: '/og-image.webp',
  transition: false,
}

export const HEADER_LINKS: Link[] = [
  {
    name: '文章',
    url: '/posts',
  },
  {
    name: '标签',
    url: '/tags',
  },
  {
    name: '项目',
    url: '/projects',
  },
  {
    name: '相册',
    url: '/photos',
  },
]

export const FOOTER_LINKS: Link[] = [
  {
    name: '主页',
    url: '/',
  },
  {
    name: '文章',
    url: '/posts',
  },
  {
    name: '项目',
    url: '/projects',
  },
  {
    name: '标签',
    url: '/tags',
  },
  {
    name: '相册',
    url: '/photos',
  },
]

// get icon https://icon-sets.iconify.design/
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'github',
    url: 'https://github.com/RUBisco0211',
    icon: 'icon-[ri--github-fill]',
  },
  //   {
  //     name: 'twitter',
  //     url: 'https://x.com/yourname',
  //     icon: 'icon-[ri--twitter-x-fill]',
  //   },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/14113855',
    icon: 'icon-[ri--bilibili-fill]',
  },
]

/**
 * SkillsShowcase 配置接口 / SkillsShowcase configuration type
 * @property {boolean} SKILLS_ENABLED  - 是否启用SkillsShowcase功能 / Whether to enable SkillsShowcase features
 * @property {Object} SKILLS_DATA - 技能展示数据 / Skills showcase data
 * @property {string} SKILLS_DATA.direction - 技能展示方向 / Skills showcase direction
 * @property {Object} SKILLS_DATA.skills - 技能展示数据 / Skills showcase data
 * @property {string} SKILLS_DATA.skills.icon - 技能图标 / Skills icon
 * @property {string} SKILLS_DATA.skills.name - 技能名称 / Skills name
 * get icon https://icon-sets.iconify.design/
 */
export const SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig = {
  SKILLS_ENABLED: false,
  SKILLS_DATA: [
    {
      direction: 'left',
      skills: [
        // {
        //   name: 'JavaScript',
        //   icon: 'icon-[skill-icons--javascript]',
        //   url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        // },
        // {
        //   name: 'CSS',
        //   icon: 'icon-[skill-icons--css]',
        //   url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        // },
        // {
        //   name: 'HTML',
        //   icon: 'icon-[skill-icons--html]',
        //   url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        // },
        {
          name: 'TypeScript',
          icon: 'icon-[skill-icons--typescript]',
          url: 'https://www.typescriptlang.org/',
        },
        {
          name: 'Vue',
          icon: 'icon-[skill-icons--vuejs-dark]',
          url: 'https://vuejs.org/',
        },
        {
          name: 'Sass',
          icon: 'icon-[skill-icons--sass]',
          url: 'https://sass-lang.com/',
        },
      ],
    },
    {
      direction: 'right',
      skills: [
        {
          name: 'Astro',
          icon: 'icon-[skill-icons--astro]',
          url: 'https://astro.build/',
        },
        {
          name: 'Node.js',
          icon: 'icon-[skill-icons--nodejs-dark]',
          url: 'https://nodejs.org/',
        },
        // {
        //   name: 'React',
        //   icon: 'icon-[skill-icons--react-dark]',
        //   url: 'https://react.dev/',
        // },
        // {
        //   name: 'Next.js',
        //   icon: 'icon-[skill-icons--nextjs-dark]',
        //   url: 'https://nextjs.org/',
        // },
        {
          name: 'Tailwind CSS',
          icon: 'icon-[skill-icons--tailwindcss-dark]',
          url: 'https://tailwindcss.com/',
        },
        {
          name: 'Vite',
          icon: 'icon-[skill-icons--vite-dark]',
          url: 'https://vitejs.dev/',
        },
      ],
    },
    {
      direction: 'left',
      skills: [
        // {
        //   name: 'Ubuntu',
        //   icon: 'icon-[skill-icons--ubuntu-dark]',
        //   url: 'https://ubuntu.com/',
        // },
        {
          name: 'Git',
          icon: 'icon-[skill-icons--git]',
          url: 'https://git-scm.com/',
        },
        // {
        //   name: 'MongoDB',
        //   icon: 'icon-[skill-icons--mongodb]',
        //   url: 'https://www.mongodb.com/',
        // },
        {
          name: 'Vercel',
          icon: 'icon-[skill-icons--vercel-dark]',
          url: 'https://vercel.com/',
        },
        {
          name: 'VS Code',
          icon: 'icon-[skill-icons--vscode-dark]',
          url: 'https://code.visualstudio.com/',
        },
        {
          name: 'Obsidian',
          icon: 'icon-[skill-icons--obsidian-dark]',
          url: 'https://obsidian.md/',
        },
      ],
    },
  ],
}

/**
 * GitHub配置 / GitHub configuration
 *
 * @property {boolean} ENABLED - 是否启用GitHub功能 / Whether to enable GitHub features
 * @property {string} GITHUB_USERNAME - GITHUB用户名 / GitHub username
 * @property {boolean} TOOLTIP_ENABLED - 是否开启Tooltip功能 / Whether to enable Github Tooltip features
 */

export const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'RUBisco0211',
  TOOLTIP_ENABLED: true,
}

//--- Posts Page Config ---
export const POSTS_CONFIG: PostConfig = {
  title: '文章',
  description: '',
  introduce: '已发布的所有文章',
  author: 'RUBisco',
  homePageConfig: {
    size: 5,
    type: 'time-line',
  },
  postPageConfig: {
    size: 10,
    type: 'time-line',
    coverLayout: 'right',
  },
  tagsPageConfig: {
    size: 10,
    type: 'time-line',
  },
  ogImageUseCover: false,
  postType: 'metaOnly',
  imageDarkenInDark: true,
  readMoreText: '阅读更多',
  prevPageText: '上一页',
  nextPageText: '下一页',
  tocText: '目录',
  backToPostsText: '返回文章列表',
  nextPostText: '下一篇',
  prevPostText: '上一篇',
  recommendText: '推荐阅读',
  wordCountView: true,
}

export const COMMENT_CONFIG: CommentConfig = {
  enabled: false,
  system: 'gitalk',
  gitalk: {
    clientID: import.meta.env.PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.PUBLIC_GITHUB_CLIENT_SECRET,
    repo: 'gitalk-comment',
    owner: 'RUBisco0211',
    admin: ['RUBisco0211'],
    language: 'zh-CN',
    perPage: 5,
    pagerDirection: 'last',
    createIssueManually: false,
    distractionFreeMode: false,
    enableHotKey: true,
  },
}

export const TAGS_CONFIG: TagsConfig = {
  title: '标签',
  description: '文章标签列表',
  introduce: '所有标签',
}

export const PROJECTS_CONFIG: ProjectConfig = {
  title: '项目',
  description: '我的一些项目',
  introduce: '我的一些项目',
}

export const PHOTOS_CONFIG: PhotosConfig = {
  title: '相册',
  description: '记录生活',
  introduce: '记录生活',
}

export const ANALYTICS_CONFIG: AnalyticsConfig = {
  vercount: {
    enabled: true,
  },
  umami: {
    enabled: false,
    websiteId: 'Your websiteId in umami',
    serverUrl: 'https://cloud.umami.is/script.js',
  },
}
