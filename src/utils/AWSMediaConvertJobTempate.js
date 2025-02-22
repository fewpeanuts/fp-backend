"use strict";

export const getMediaConvertTemplate = (s3Bucket, originalKey, toFolder) => {
  return {
    UserMetadata: {},
    Role: process.env.AWS_ROLE_ARN,
    Settings: {
      OutputGroups: [
        {
          CustomName: "MP4",
          Name: "File Group",
          Outputs: [
            {
              ContainerSettings: {
                Container: "MP4",
                Mp4Settings: {
                  CslgAtom: "INCLUDE",
                  FreeSpaceBox: "EXCLUDE",
                  MoovPlacement: "PROGRESSIVE_DOWNLOAD"
                }
              },
              VideoDescription: {
                Width:  720 ,
                ScalingBehavior: "DEFAULT",
                Height: 1280,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 3000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC"
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4"
                    }
                  },
                  LanguageCodeControl: "FOLLOW_INPUT"
                }
              ]
            }
          ],
          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: "s3://" + s3Bucket + "/" + toFolder + "/MP4/"
            }
          }
        },
        {
          CustomName: "HLS",
          Name: "Apple HLS",
          Outputs: [
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  Scte35Source: "NONE",
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  VideoPid: 481,
                  AudioPids: [482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492]
                }
              },
              VideoDescription: {
                Width: 360,
                ScalingBehavior: "DEFAULT",
                Height: 640,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 1000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC"
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4"
                    }
                  },
                  LanguageCodeControl: "FOLLOW_INPUT"
                }
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  SegmentModifier: "$dt$",
                  IFrameOnlyManifest: "EXCLUDE"
                }
              },
              NameModifier: "_360"
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  Scte35Source: "NONE",
                  Scte35Pid: 500,
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  TimedMetadataPid: 502,
                  VideoPid: 481,
                  AudioPids: [482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492]
                }
              },
              VideoDescription: {
                Width: 720,
                ScalingBehavior: "DEFAULT",
                Height: 1280,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 3000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC"
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4"
                    }
                  },
                  LanguageCodeControl: "FOLLOW_INPUT"
                }
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  SegmentModifier: "$dt$",
                  IFrameOnlyManifest: "EXCLUDE"
                }
              },
              NameModifier: "_720"
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  Scte35Source: "NONE",
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  VideoPid: 481,
                  AudioPids: [482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492]
                }
              },
              VideoDescription: {
                Width: 1080,
                ScalingBehavior: "DEFAULT",
                Height: 1920,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 3000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC"
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4"
                    }
                  },
                  LanguageCodeControl: "FOLLOW_INPUT"
                }
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  IFrameOnlyManifest: "EXCLUDE"
                }
              },
              NameModifier: "_1080"
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  Scte35Source: "NONE",
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  VideoPid: 481,
                  AudioPids: [482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492]
                }
              },
              VideoDescription: {
                Width: 480,
                ScalingBehavior: "DEFAULT",
                Height: 852,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 2000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC"
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4"
                    }
                  },
                  LanguageCodeControl: "FOLLOW_INPUT"
                }
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  IFrameOnlyManifest: "EXCLUDE"
                }
              },
              NameModifier: "_480"
            }
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              ManifestDurationFormat: "INTEGER",
              SegmentLength: 10,
              TimedMetadataId3Period: 10,
              CaptionLanguageSetting: "OMIT",
              Destination: "s3://" + s3Bucket + "/" + toFolder + "/HLS/",
              TimedMetadataId3Frame: "PRIV",
              CodecSpecification: "RFC_4281",
              OutputSelection: "MANIFESTS_AND_SEGMENTS",
              ProgramDateTimePeriod: 600,
              MinSegmentLength: 0,
              MinFinalSegmentLength: 0,
              DirectoryStructure: "SINGLE_DIRECTORY",
              ProgramDateTime: "EXCLUDE",
              SegmentControl: "SEGMENTED_FILES",
              ManifestCompression: "NONE",
              ClientCache: "ENABLED",
              StreamInfResolution: "INCLUDE"
            }
          }
        },
        {
          CustomName: "Thumbnails",
          Name: "File Group",
          Outputs: [
            {
              ContainerSettings: {
                Container: "RAW"
              },
              VideoDescription: {
                Width: 720,
                ScalingBehavior: "DEFAULT",
                Height: 1280,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "FRAME_CAPTURE",
                  FrameCaptureSettings: {
                    FramerateNumerator: 1,
                    FramerateDenominator: 10,
                    MaxCaptures: 50,
                    Quality: 80
                  }
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT"
              },
              NameModifier: "Thumbnails"
            }
          ],
          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: "s3://" + s3Bucket + "/" + toFolder + "/Thumbnails/"
            }
          }
        }
      ],
      AdAvailOffset: 0,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              Offset: 0,
              DefaultSelection: "DEFAULT",
              ProgramSelection: 1
            }
          },
          VideoSelector: {
            ColorSpace: "FOLLOW",
            Rotate: "AUTO"
          },
          FilterEnable: "AUTO",
          PsiControl: "USE_PSI",
          FilterStrength: 0,
          DeblockFilter: "DISABLED",
          DenoiseFilter: "DISABLED",
          TimecodeSource: "EMBEDDED",
          FileInput: "s3://" + s3Bucket + "/" + originalKey
        }
      ]
    }
  };
};
