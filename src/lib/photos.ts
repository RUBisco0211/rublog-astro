import type { PhotoData } from '~/types'

export const PhotosList: PhotoData[] = [
  {
    title: '最近在看什么？',
    icon: {
      type: 'emoji',
      value: '📺',
    },
    description: '《火线》、《真探》S1、《杀戮一代》',
    date: '2026-02-10',
    travel: '',
    photos: [
      {
        src: 'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/1bc3aff5-0d6a-4c0b-8ed0-5716ca30ab3b/d54c9175-7a12-46aa-bad0-80544042a08d?host=wbd-images.prod-vod.h264.io&partner=beamcom',
        alt: 'The Wire',
        width: 1280,
        height: 720,
        variant: '4x3',
      },
      {
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR28AqKOZFG3TE8QuDWw1yregQ2kpuDagmZTg&s',
        alt: 'True Detective S1',
        width: 1280,
        height: 720,
        variant: '4x5',
      },
      {
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBmTXM454sxKwa0-RCJxXPVBzsleqjF_qtorgJUi1caoY8kAG-oud27I73lweBkyUOcekweitdKW3qBV2BOv2DjyRfl4L4KLxn1ywrA&s=10',
        alt: 'Generation Kill',
        width: 1280,
        height: 720,
        variant: '4x3',
      },
    ],
  },
]
