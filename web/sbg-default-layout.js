// Curated default layout, shown on a fresh install before any customisation.
// A hand-maintained snapshot of a layout-editor profile, so edit it directly.
// Sections tied to specific custom nodes auto-hide when their data is absent.
export const DEFAULT_IMAGE_LAYOUT = [
  {
    "id": "file_info",
    "title": "文件信息",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "filename",
        "label": "",
        "style": "title"
      },
      {
        "path": "path",
        "label": "路径",
        "_prevStyle": "kv",
        "style": "hidden"
      },
      {
        "path": "filesize",
        "label": "大小",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "resolution",
        "label": "分辨率",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "modified",
        "label": "修改时间",
        "_prevStyle": "kv",
        "style": "hidden"
      },
      {
        "path": "codec",
        "label": "编码格式",
        "style": "hidden",
        "_prevStyle": "kv"
      }
    ]
  },
  {
    "id": "models",
    "title": "模型",
    "style": "cards",
    "open": true,
    "params": [
      {
        "path": "model",
        "label": "模型",
        "style": "title",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      },
      {
        "path": "clip_models",
        "label": "CLIP",
        "style": "detail"
      },
      {
        "path": "text_projection",
        "label": "文本投影",
        "style": "detail"
      },
      {
        "path": "vae",
        "label": "VAE",
        "style": "detail"
      },
      {
        "path": "audio_vae",
        "label": "音频 VAE",
        "style": "detail"
      },
      {
        "path": "clip_skip",
        "label": "CLIP 跳过层数",
        "_prevStyle": "detail",
        "style": "hidden"
      }
    ]
  },
  {
    "id": "sampling",
    "title": "采样",
    "style": "cards",
    "open": true,
    "source": "samplers",
    "highlow": true,
    "params": [
      {
        "path": "samplers.sampler_name",
        "label": "采样器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.scheduler",
        "label": "调度器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.cfg",
        "label": "CFG",
        "style": "pill",
        "format": "CFG: {v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.steps",
        "label": "步数",
        "style": "pill",
        "format": "步数：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.shift",
        "label": "偏移",
        "style": "pill",
        "format": "偏移：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.start_at_step",
        "label": "起始步数",
        "style": "detail"
      },
      {
        "path": "samplers.end_at_step",
        "label": "结束步数",
        "style": "detail"
      },
      {
        "path": "samplers.denoise",
        "label": "去噪强度",
        "style": "hidden",
        "format": "去噪：{v}",
        "_prevStyle": "pill"
      },
      {
        "path": "samplers.add_noise",
        "label": "添加噪声",
        "style": "hidden",
        "format": "添加噪声：{v}",
        "_prevStyle": "detail"
      },
      {
        "path": "samplers.return_with_leftover_noise",
        "label": "保留剩余噪声",
        "style": "hidden",
        "_prevStyle": "detail"
      },
      {
        "path": "samplers.seed",
        "label": "随机种子",
        "style": "detail"
      }
    ]
  },
  {
    "id": "loras",
    "title": "LoRA",
    "style": "cards",
    "open": true,
    "source": "loras",
    "highlow": false,
    "params": [
      {
        "path": "loras.name",
        "label": "LoRA 名称",
        "style": "title",
        "color": {
          "text": "rgba(255, 255, 255, 1)"
        }
      },
      {
        "path": "loras.strength_model",
        "label": "强度",
        "style": "detail",
        "format": "强度：{v}",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      }
    ]
  },
  {
    "id": "s_mq7yjaqb_0",
    "title": "功能",
    "style": "flat",
    "open": true,
    "params": [],
    "tabs": [
      {
        "id": "tab_mq7yjq49_1",
        "label": "ControlNet",
        "style": "cards",
        "params": [
          {
            "path": "controlnet.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "controlnet.preprocessor",
            "label": "预处理器",
            "style": "detail"
          },
          {
            "path": "controlnet.weight",
            "label": "权重",
            "style": "detail"
          },
          {
            "path": "controlnet.start_percent",
            "label": "起始比例",
            "style": "pill",
            "format": "起始：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "controlnet.end_percent",
            "label": "结束比例",
            "style": "pill",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            },
            "format": "结束：{v}"
          },
          {
            "path": "controlnet.guidance_start",
            "label": "引导起点",
            "style": "detail"
          },
          {
            "path": "controlnet.guidance_end",
            "label": "引导终点",
            "style": "detail"
          },
          {
            "path": "samplers.end_at_step",
            "label": "结束步数",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "workflow_nodes.Primitive integer [Crystools].int",
            "label": "步数",
            "style": "pill",
            "match": {
              "title": "CN End Step"
            },
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            },
            "format": "{v} 步"
          },
          {
            "path": "controlnet.strength",
            "label": "强度",
            "style": "pill",
            "format": "强度：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          }
        ]
      },
      {
        "id": "tab_mq7yjwyj_2",
        "label": "ADetailer",
        "style": "flat",
        "params": [
          {
            "path": "adetailer.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "adetailer.sampler_name",
            "label": "采样器",
            "style": "pill",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "adetailer.scheduler",
            "label": "调度器",
            "style": "pill",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "adetailer.cfg",
            "label": "CFG",
            "style": "pill",
            "format": "CFG: {v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "adetailer.steps",
            "label": "步数",
            "style": "pill",
            "format": "{v} 步",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "adetailer.denoise",
            "label": "去噪强度",
            "style": "pill",
            "format": "去噪：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          }
        ]
      },
      {
        "id": "tab_mq941cgi_1",
        "label": "放大",
        "style": "cards",
        "params": [
          {
            "path": "upscaling.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "upscaling.clip",
            "label": "CLIP",
            "style": "detail"
          },
          {
            "path": "upscaling.vae",
            "label": "VAE",
            "style": "detail"
          },
          {
            "path": "upscaling.type",
            "label": "类型",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "upscaling.upscale_method",
            "label": "方法",
            "style": "detail"
          },
          {
            "path": "upscaling.scale_by",
            "label": "缩放倍率",
            "style": "pill",
            "format": "倍率：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "upscaling.width",
            "label": "宽度",
            "style": "detail"
          },
          {
            "path": "upscaling.height",
            "label": "高度",
            "style": "detail"
          },
          {
            "path": "upscaling.longer_edge",
            "label": "长边",
            "style": "detail"
          },
          {
            "path": "upscaling.megapixels",
            "label": "百万像素",
            "style": "detail"
          },
          {
            "path": "upscaling.target_resolution",
            "label": "目标分辨率",
            "style": "detail"
          },
          {
            "path": "upscaling.initial_resolution",
            "label": "初始分辨率",
            "style": "pill",
            "format": "初始：{v}"
          },
          {
            "path": "upscaling.final_resolution",
            "label": "最终分辨率",
            "style": "pill",
            "format": "最终：{v}"
          },
          {
            "path": "upscaling.prompt",
            "label": "提示词",
            "style": "hidden",
            "_prevStyle": "text"
          }
        ],
        "showWhen": "upscaling",
        "source": "upscaling"
      }
    ]
  },
  {
    "id": "s_mpusgpqo_0",
    "title": "大语言模型",
    "style": "flat",
    "open": true,
    "params": [],
    "highlow": false,
    "tabs": [
      {
        "id": "tab_mpxw5c4m_1",
        "label": "LLava",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.LLava Loader Simple.ckpt_name",
            "label": "模型",
            "style": "title",
            "format": "{v}",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.ckpt_name",
            "label": "检查点名称",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerSimple.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.max_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "format": "Token 数：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerSimple.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.temperature",
            "label": "温度",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "温度：{v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.top_p",
            "label": "Top P",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.top_p",
            "label": "Top P",
            "style": "pill",
            "format": "Top P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.top_k",
            "label": "Top K",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.top_k",
            "label": "Top K",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top K: {v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.frequency_penalty",
            "label": "频率惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.frequency_penalty",
            "label": "频率惩罚",
            "style": "pill",
            "format": "频率惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.presence_penalty",
            "label": "存在惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.presence_penalty",
            "label": "存在惩罚",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "存在惩罚：{v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.repeat_penalty",
            "label": "重复惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.repeat_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.system_msg",
            "label": "系统消息",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.prompt",
            "label": "提示词",
            "style": "text",
            "color": {
              "bg": "rgba(24, 52, 37, 0.75)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "Show Any"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "Output"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.LLava Loader Simple.ckpt_name"
      },
      {
        "id": "tab_mpwr9up6_0",
        "label": "QwenVL",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.model_name",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.max_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "format": "Token 数：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.temperature",
            "label": "温度",
            "style": "pill",
            "format": "温度：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.top_p",
            "label": "Top P",
            "style": "pill",
            "format": "Top P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.repetition_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.custom_system_prompt",
            "label": "系统提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.prompt_text",
            "label": "用户提示词",
            "style": "hidden",
            "_prevStyle": "text"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text",
            "label": "文本",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text_0",
            "label": "文本 0",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text_undefined",
            "label": "未定义文本",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "hidden",
            "_prevStyle": "text"
          }
        ]
      },
      {
        "id": "tab_mpwrfbaa_1",
        "label": "JoyCaption",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.JC_GGUF_adv.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.max_new_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Token 数：{v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.temperature",
            "label": "温度",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "温度：{v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.top_p",
            "label": "Top P",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top P: {v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.top_k",
            "label": "Top K",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top K: {v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.custom_prompt",
            "label": "系统提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.anything",
            "label": "输出",
            "style": "text"
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "JoyCaption Output"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.JC_GGUF_adv.model"
      },
      {
        "id": "tab_mq93pdk6_0",
        "label": "VLM",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.LLMPromptGenerator.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.top_p",
            "label": "Top P",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.top_k",
            "label": "Top K",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.frequency_penalty",
            "label": "频率惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.presence_penalty",
            "label": "存在惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.repeat_penalty",
            "label": "重复惩罚",
            "style": "detail"
          }
        ]
      },
      {
        "id": "tab_mqm0aaft_0",
        "label": "TextGenerate",
        "style": "flat",
        "params": [
          {
            "path": "clip_models",
            "label": "CLIP 模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.max_length",
            "label": "最大长度",
            "style": "pill",
            "color": {
              "text": "rgba(255, 255, 255, 1)",
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "最大值：{v}"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.temperature",
            "label": "温度",
            "style": "pill",
            "format": "温度：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.top_k",
            "label": "Top K",
            "style": "pill",
            "format": "Top K: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.top_p",
            "label": "Top P",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top P: {v}"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.min_p",
            "label": "Min P",
            "style": "pill",
            "format": "Min P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.repetition_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.presence_penalty",
            "label": "存在惩罚",
            "style": "hidden",
            "format": "存在惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode",
            "label": "采样模式",
            "style": "hidden",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "采样：{v}",
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.thinking",
            "label": "思考",
            "style": "hidden",
            "format": "思考：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.use_default_template",
            "label": "使用默认模板",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.seed",
            "label": "随机种子",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "workflow_nodes.TextGenerate.prompt",
            "label": "提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.TextGenerate"
      }
    ]
  },
  {
    "id": "positive",
    "title": "正向提示词",
    "style": "text",
    "open": true,
    "params": [],
    "color": {
      "bg": "rgba(22, 42, 31, 1)",
      "border": "rgba(33, 196, 93, 0.25)",
      "text": "rgba(224, 224, 255, 1)"
    },
    "tabs": [
      {
        "id": "tab_mpwso1um_0",
        "label": "初始",
        "style": "text",
        "params": [
          {
            "path": "initial_prompt",
            "label": "初始提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      },
      {
        "id": "tab_mpwsoi7k_1",
        "label": "增强后",
        "style": "text",
        "params": [
          {
            "path": "positive_prompt",
            "label": "正向提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "negative",
    "title": "负向提示词",
    "style": "text",
    "open": true,
    "params": [
      {
        "path": "negative_prompt",
        "label": "负向提示词",
        "style": "text"
      }
    ],
    "color": {
      "bg": "rgba(42, 24, 27, 1)",
      "border": "rgba(239, 68, 68, 0.25)"
    }
  },
  {
    "id": "workflow_nodes",
    "title": "工作流节点",
    "style": "nodes",
    "open": false,
    "params": []
  },
  {
    "id": "extra",
    "title": "附加元数据",
    "style": "flat",
    "open": false,
    "params": [
      {
        "path": "extra.*"
      }
    ],
    "hidden": true
  },
  {
    "id": "raw",
    "title": "原始元数据",
    "style": "raw",
    "open": false,
    "params": [],
    "hidden": true
  }
];

export const DEFAULT_AUDIO_LAYOUT = [
  {
    "id": "file_info",
    "title": "文件信息",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "filename",
        "label": "",
        "style": "title"
      },
      {
        "path": "path",
        "label": "路径",
        "_prevStyle": "kv",
        "style": "hidden"
      },
      {
        "path": "filesize",
        "label": "大小",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "duration",
        "label": "时长",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "codec",
        "label": "编码格式",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "sample_rate",
        "label": "采样率",
        "style": "pill",
        "format": "{v} Hz",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "bitrate",
        "label": "比特率",
        "style": "pill",
        "format": "{v} kbps",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "channels",
        "label": "声道数",
        "style": "pill",
        "format": "声道数：{v}"
      },
      {
        "path": "modified",
        "label": "修改时间",
        "_prevStyle": "kv",
        "style": "hidden"
      }
    ]
  },
  {
    "id": "track",
    "title": "音轨",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "track.title",
        "label": "标题",
        "style": "detail"
      },
      {
        "path": "track.artist",
        "label": "艺术家",
        "style": "detail"
      },
      {
        "path": "track.album",
        "label": "专辑",
        "style": "detail"
      },
      {
        "path": "track.album_artist",
        "label": "专辑艺术家",
        "style": "detail",
        "color": {}
      },
      {
        "path": "track.genre",
        "label": "流派",
        "style": "detail"
      },
      {
        "path": "track.date",
        "label": "日期",
        "style": "detail"
      },
      {
        "path": "track.track",
        "label": "音轨编号",
        "style": "detail"
      },
      {
        "path": "track.composer",
        "label": "作曲者",
        "style": "detail"
      }
    ]
  },
  {
    "id": "models",
    "title": "模型",
    "style": "cards",
    "open": true,
    "params": [
      {
        "path": "model",
        "label": "模型",
        "style": "title",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      },
      {
        "path": "clip_models",
        "label": "CLIP",
        "style": "detail"
      },
      {
        "path": "text_projection",
        "label": "文本投影",
        "style": "detail"
      },
      {
        "path": "vae",
        "label": "VAE",
        "style": "detail"
      },
      {
        "path": "audio_vae",
        "label": "音频 VAE",
        "style": "detail"
      }
    ]
  },
  {
    "id": "sampling",
    "title": "采样",
    "style": "cards",
    "open": true,
    "source": "samplers",
    "highlow": true,
    "params": [
      {
        "path": "samplers.sampler_name",
        "label": "采样器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.scheduler",
        "label": "调度器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.cfg",
        "label": "CFG",
        "style": "pill",
        "format": "CFG: {v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.steps",
        "label": "步数",
        "style": "pill",
        "format": "步数：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.shift",
        "label": "偏移",
        "style": "pill",
        "format": "偏移：{v}"
      },
      {
        "path": "samplers.denoise",
        "label": "去噪强度",
        "style": "hidden",
        "format": "去噪：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        },
        "_prevStyle": "pill"
      },
      {
        "path": "samplers.seed",
        "label": "随机种子",
        "style": "detail"
      }
    ]
  },
  {
    "id": "loras",
    "title": "LoRA",
    "style": "cards",
    "open": true,
    "source": "loras",
    "highlow": false,
    "params": [
      {
        "path": "loras.name",
        "label": "LoRA 名称",
        "style": "title",
        "color": {
          "text": "rgba(255, 255, 255, 1)"
        }
      },
      {
        "path": "loras.strength_model",
        "label": "强度",
        "style": "detail",
        "format": "强度：{v}",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      }
    ]
  },
  {
    "id": "song",
    "title": "歌曲",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.bpm",
        "label": "BPM",
        "style": "pill",
        "format": "BPM: {v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.keyscale",
        "label": "调性",
        "style": "pill",
        "format": "调性：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.timesignature",
        "label": "拍号",
        "style": "pill",
        "format": "拍号：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.language",
        "label": "语言",
        "style": "detail",
        "format": "语言：{v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.cfg_scale",
        "label": "CFG 系数",
        "style": "pill",
        "format": "CFG 系数：{v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.generate_audio_codes",
        "label": "生成音频编码",
        "style": "detail"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.temperature",
        "label": "温度",
        "style": "pill",
        "format": "温度：{v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.top_p",
        "label": "Top P",
        "style": "pill",
        "format": "Top P: {v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.top_k",
        "label": "Top K",
        "style": "pill",
        "format": "Top K: {v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.min_p",
        "label": "Min P",
        "style": "pill",
        "format": "Min P: {v}"
      },
      {
        "path": "workflow_nodes.TextEncodeAceStepAudio1.5.seed",
        "label": "随机种子",
        "style": "detail"
      }
    ]
  },
  {
    "id": "voice",
    "title": "语音",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "workflow_nodes.ChatterBoxEngineNode.language",
        "label": "语言",
        "style": "pill",
        "format": "语言：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.ChatterBoxEngineNode.exaggeration",
        "label": "夸张程度",
        "style": "pill",
        "format": "夸张程度：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.ChatterBoxEngineNode.temperature",
        "label": "温度",
        "style": "pill",
        "format": "温度：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.ChatterBoxEngineNode.cfg_weight",
        "label": "CFG 权重",
        "style": "pill",
        "format": "CFG: {v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "workflow_nodes.CharacterVoicesNode.voice_name",
        "label": "语音",
        "style": "detail"
      },
      {
        "path": "workflow_nodes.UnifiedTTSTextNode.text",
        "label": "朗读文本",
        "style": "text",
        "color": {
          "bg": "rgba(23, 43, 32, 1)"
        }
      }
    ]
  },
  {
    "id": "positive",
    "title": "正向提示词",
    "style": "text",
    "open": true,
    "params": [],
    "color": {
      "bg": "rgba(22, 42, 31, 1)",
      "border": "rgba(33, 196, 93, 0.25)",
      "text": "rgba(224, 224, 255, 1)"
    },
    "tabs": [
      {
        "id": "tab_msaud1in_0",
        "label": "初始",
        "style": "text",
        "params": [
          {
            "path": "initial_prompt",
            "label": "初始提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      },
      {
        "id": "tab_msaud1en_1",
        "label": "增强后",
        "style": "text",
        "params": [
          {
            "path": "positive_prompt",
            "label": "正向提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      },
      {
        "id": "tab_msuu1nnh_0",
        "label": "标签",
        "style": "text",
        "params": [
          {
            "path": "audio_tags",
            "label": "标签",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ],
        "pillColor": {}
      },
      {
        "id": "tab_msuu1q52_1",
        "label": "歌词",
        "style": "text",
        "params": [
          {
            "path": "audio_lyrics",
            "label": "歌词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ],
        "color": {}
      }
    ]
  },
  {
    "id": "negative",
    "title": "负向提示词",
    "style": "text",
    "open": true,
    "params": [
      {
        "path": "negative_prompt",
        "label": "负向提示词",
        "style": "text"
      }
    ],
    "color": {
      "bg": "rgba(42, 24, 27, 1)",
      "border": "rgba(239, 68, 68, 0.25)"
    }
  },
  {
    "id": "workflow_nodes",
    "title": "工作流节点",
    "style": "nodes",
    "open": false,
    "params": []
  },
  {
    "id": "extra",
    "title": "附加元数据",
    "style": "flat",
    "open": false,
    "params": [
      {
        "path": "extra.*"
      }
    ],
    "hidden": true
  },
  {
    "id": "raw",
    "title": "原始元数据",
    "style": "raw",
    "open": false,
    "params": [],
    "hidden": true
  }
];

export const DEFAULT_VIDEO_LAYOUT = [
  {
    "id": "file_info",
    "title": "文件信息",
    "style": "flat",
    "open": true,
    "params": [
      {
        "path": "filename",
        "label": "",
        "style": "title"
      },
      {
        "path": "path",
        "label": "路径",
        "_prevStyle": "kv",
        "style": "hidden"
      },
      {
        "path": "filesize",
        "label": "大小",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "resolution",
        "label": "分辨率",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "duration",
        "label": "时长",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "codec",
        "label": "编码格式",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "fps",
        "label": "FPS",
        "style": "pill",
        "format": "{v}FPS",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "total_frames",
        "label": "帧数",
        "style": "hidden",
        "format": "{v} 帧",
        "_prevStyle": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "modified",
        "label": "修改时间",
        "_prevStyle": "kv",
        "style": "hidden"
      }
    ]
  },
  {
    "id": "models",
    "title": "模型",
    "style": "cards",
    "open": true,
    "params": [
      {
        "path": "model",
        "label": "模型",
        "style": "title",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      },
      {
        "path": "clip_models",
        "label": "CLIP",
        "style": "detail"
      },
      {
        "path": "text_projection",
        "label": "文本投影",
        "style": "detail"
      },
      {
        "path": "vae",
        "label": "VAE",
        "style": "detail"
      },
      {
        "path": "audio_vae",
        "label": "音频 VAE",
        "style": "detail"
      }
    ],
    "highlow": true
  },
  {
    "id": "sampling",
    "title": "采样",
    "style": "cards",
    "open": true,
    "source": "samplers",
    "highlow": true,
    "params": [
      {
        "path": "samplers.sampler_name",
        "label": "采样器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.scheduler",
        "label": "调度器",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.cfg",
        "label": "CFG",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        },
        "format": "CFG: {v}"
      },
      {
        "path": "samplers.steps",
        "label": "步数",
        "style": "pill",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        },
        "format": "步数：{v}"
      },
      {
        "path": "samplers.shift",
        "label": "偏移",
        "style": "pill",
        "format": "偏移：{v}",
        "color": {
          "bg": "rgba(255, 255, 255, 0.2)"
        }
      },
      {
        "path": "samplers.start_at_step",
        "label": "起始步数",
        "style": "detail"
      },
      {
        "path": "samplers.end_at_step",
        "label": "结束步数",
        "style": "detail"
      },
      {
        "path": "samplers.denoise",
        "label": "去噪强度",
        "style": "hidden",
        "format": "去噪：{v}",
        "_prevStyle": "pill"
      },
      {
        "path": "samplers.add_noise",
        "label": "添加噪声",
        "style": "hidden",
        "format": "添加噪声：{v}",
        "_prevStyle": "detail"
      },
      {
        "path": "samplers.return_with_leftover_noise",
        "label": "保留剩余噪声",
        "style": "hidden",
        "_prevStyle": "detail"
      },
      {
        "path": "samplers.seed",
        "label": "随机种子",
        "style": "detail"
      }
    ]
  },
  {
    "id": "loras",
    "title": "LoRA",
    "style": "cards",
    "open": true,
    "source": "loras",
    "highlow": true,
    "params": [
      {
        "path": "loras.name",
        "label": "LoRA 名称",
        "style": "title",
        "color": {
          "text": "rgba(255, 255, 255, 1)"
        }
      },
      {
        "path": "loras.strength_model",
        "label": "强度",
        "style": "detail",
        "format": "强度：{v}",
        "color": {
          "text": "rgba(254, 196, 62, 1)"
        }
      }
    ]
  },
  {
    "id": "s_mpxnozz4_0",
    "title": "功能",
    "style": "flat",
    "open": true,
    "params": [],
    "tabs": [
      {
        "id": "tab_mpxnpbof_1",
        "label": "MMAudio",
        "style": "cards",
        "params": [
          {
            "path": "mmaudio.prompt",
            "label": "提示词",
            "style": "text",
            "color": {
              "bg": "rgba(24, 52, 37, 1)"
            }
          },
          {
            "path": "mmaudio.negative_prompt",
            "label": "负向提示词",
            "style": "text",
            "color": {
              "bg": "rgba(59, 28, 33, 1)"
            }
          },
          {
            "path": "mmaudio.cfg",
            "label": "CFG",
            "style": "pill",
            "format": "CFG: {v}",
            "color": {
              "bg": "rgba(37, 213, 248, 0.3)",
              "text": "rgba(255, 255, 255, 1)"
            }
          },
          {
            "path": "mmaudio.steps",
            "label": "步数",
            "style": "pill",
            "color": {
              "text": "rgba(255, 255, 255, 1)",
              "bg": "rgba(37, 213, 248, 0.3)"
            },
            "format": "步数：{v}"
          },
          {
            "path": "mmaudio.seed",
            "label": "随机种子",
            "style": "detail"
          }
        ],
        "source": "mmaudio"
      },
      {
        "id": "tab_mpxnszr6_2",
        "label": "插帧",
        "style": "cards",
        "params": [
          {
            "path": "interpolation.type",
            "label": "类型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "interpolation.model_name",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "interpolation.ckpt_name",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "interpolation.multiplier",
            "label": "倍数",
            "style": "detail"
          },
          {
            "path": "interpolation.scale",
            "label": "缩放倍率",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "interpolation.source_fps",
            "label": "源帧率",
            "style": "pill",
            "format": "源帧率：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "interpolation.target_fps",
            "label": "目标帧率",
            "style": "pill",
            "format": "最终帧率：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "total_frames",
            "label": "总帧数",
            "style": "hidden",
            "_prevStyle": "detail"
          }
        ]
      },
      {
        "id": "tab_mpxny7vj_3",
        "label": "放大",
        "style": "cards",
        "params": [
          {
            "path": "upscaling.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "upscaling.clip",
            "label": "CLIP",
            "style": "detail"
          },
          {
            "path": "upscaling.vae",
            "label": "VAE",
            "style": "detail"
          },
          {
            "path": "upscaling.type",
            "label": "类型",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "upscaling.upscale_method",
            "label": "方法",
            "style": "detail"
          },
          {
            "path": "upscaling.scale_by",
            "label": "缩放倍率",
            "style": "pill",
            "format": "倍率：{v}",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "upscaling.width",
            "label": "宽度",
            "style": "detail"
          },
          {
            "path": "upscaling.height",
            "label": "高度",
            "style": "detail"
          },
          {
            "path": "upscaling.longer_edge",
            "label": "长边",
            "style": "detail"
          },
          {
            "path": "upscaling.megapixels",
            "label": "百万像素",
            "style": "detail"
          },
          {
            "path": "upscaling.target_resolution",
            "label": "目标分辨率",
            "style": "detail"
          },
          {
            "path": "upscaling.initial_resolution",
            "label": "初始分辨率",
            "style": "pill",
            "format": "初始：{v}"
          },
          {
            "path": "upscaling.final_resolution",
            "label": "最终分辨率",
            "style": "pill",
            "format": "最终：{v}"
          },
          {
            "path": "upscaling.prompt",
            "label": "提示词",
            "style": "hidden",
            "_prevStyle": "text"
          }
        ],
        "showWhen": "upscaling"
      }
    ]
  },
  {
    "id": "s_ms62waap_4",
    "title": "大语言模型",
    "style": "flat",
    "open": true,
    "params": [],
    "highlow": false,
    "tabs": [
      {
        "id": "tab_ms62waap_5",
        "label": "LLava",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.LLava Loader Simple.ckpt_name",
            "label": "模型",
            "style": "title",
            "format": "{v}",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.ckpt_name",
            "label": "检查点名称",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerSimple.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.max_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "format": "Token 数：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerSimple.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.temperature",
            "label": "温度",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "温度：{v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.top_p",
            "label": "Top P",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.top_p",
            "label": "Top P",
            "style": "pill",
            "format": "Top P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.top_k",
            "label": "Top K",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.top_k",
            "label": "Top K",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top K: {v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.frequency_penalty",
            "label": "频率惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.frequency_penalty",
            "label": "频率惩罚",
            "style": "pill",
            "format": "频率惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.presence_penalty",
            "label": "存在惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.presence_penalty",
            "label": "存在惩罚",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "存在惩罚：{v}"
          },
          {
            "path": "workflow_nodes.LLavaOptionalMemoryFreeAdvanced.repeat_penalty",
            "label": "重复惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.repeat_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.system_msg",
            "label": "系统消息",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.LLavaSamplerAdvanced.prompt",
            "label": "提示词",
            "style": "text",
            "color": {
              "bg": "rgba(24, 52, 37, 0.75)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "Show Any"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "Output"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.LLava Loader Simple.ckpt_name"
      },
      {
        "id": "tab_ms62waap_6",
        "label": "QwenVL",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.model_name",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.max_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "format": "Token 数：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.temperature",
            "label": "温度",
            "style": "pill",
            "format": "温度：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.top_p",
            "label": "Top P",
            "style": "pill",
            "format": "Top P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.repetition_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)",
              "border": "rgba(125, 107, 239, 0)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.custom_system_prompt",
            "label": "系统提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.AILab_QwenVL_GGUF_PromptEnhancer.prompt_text",
            "label": "用户提示词",
            "style": "hidden",
            "_prevStyle": "text"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text",
            "label": "文本",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text_0",
            "label": "文本 0",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.ShowText|pysssss.text_undefined",
            "label": "未定义文本",
            "style": "hidden",
            "_prevStyle": "kv"
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "hidden",
            "_prevStyle": "text"
          }
        ]
      },
      {
        "id": "tab_ms62waap_7",
        "label": "JoyCaption",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.JC_GGUF_adv.model",
            "label": "模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.max_new_tokens",
            "label": "最大 Token 数",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Token 数：{v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.temperature",
            "label": "温度",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "温度：{v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.top_p",
            "label": "Top P",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top P: {v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.top_k",
            "label": "Top K",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top K: {v}"
          },
          {
            "path": "workflow_nodes.JC_GGUF_adv.custom_prompt",
            "label": "系统提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.anything",
            "label": "输出",
            "style": "text"
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "match": {
              "title": "JoyCaption Output"
            },
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.JC_GGUF_adv.model"
      },
      {
        "id": "tab_ms62waap_8",
        "label": "VLM",
        "style": "flat",
        "params": [
          {
            "path": "workflow_nodes.LLMPromptGenerator.max_tokens",
            "label": "最大 Token 数",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.temperature",
            "label": "温度",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.top_p",
            "label": "Top P",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.top_k",
            "label": "Top K",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.frequency_penalty",
            "label": "频率惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.presence_penalty",
            "label": "存在惩罚",
            "style": "detail"
          },
          {
            "path": "workflow_nodes.LLMPromptGenerator.repeat_penalty",
            "label": "重复惩罚",
            "style": "detail"
          }
        ]
      },
      {
        "id": "tab_ms62waap_9",
        "label": "TextGenerate",
        "style": "flat",
        "params": [
          {
            "path": "clip_models",
            "label": "CLIP 模型",
            "style": "title",
            "color": {
              "text": "rgba(254, 196, 62, 1)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.max_length",
            "label": "最大长度",
            "style": "pill",
            "color": {
              "text": "rgba(255, 255, 255, 1)",
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "最大值：{v}"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.temperature",
            "label": "温度",
            "style": "pill",
            "format": "温度：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.top_k",
            "label": "Top K",
            "style": "pill",
            "format": "Top K: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.top_p",
            "label": "Top P",
            "style": "pill",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "Top P: {v}"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.min_p",
            "label": "Min P",
            "style": "pill",
            "format": "Min P: {v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.repetition_penalty",
            "label": "重复惩罚",
            "style": "pill",
            "format": "重复惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.presence_penalty",
            "label": "存在惩罚",
            "style": "hidden",
            "format": "存在惩罚：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode",
            "label": "采样模式",
            "style": "hidden",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "format": "采样：{v}",
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.thinking",
            "label": "思考",
            "style": "hidden",
            "format": "思考：{v}",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            },
            "_prevStyle": "pill"
          },
          {
            "path": "workflow_nodes.TextGenerate.use_default_template",
            "label": "使用默认模板",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "workflow_nodes.TextGenerate.sampling_mode.seed",
            "label": "随机种子",
            "style": "hidden",
            "_prevStyle": "detail"
          },
          {
            "path": "workflow_nodes.TextGenerate.prompt",
            "label": "提示词",
            "style": "text",
            "color": {
              "bg": "rgba(255, 255, 255, 0.2)"
            }
          },
          {
            "path": "workflow_nodes.easy showAnything.text",
            "label": "输出",
            "style": "text",
            "color": {
              "bg": "rgba(254, 196, 62, 0.25)"
            }
          }
        ],
        "showWhen": "workflow_nodes.TextGenerate"
      }
    ]
  },
  {
    "id": "positive",
    "title": "正向提示词",
    "style": "text",
    "open": true,
    "params": [],
    "color": {
      "bg": "rgba(22, 42, 31, 1)",
      "border": "rgba(33, 196, 93, 0.25)",
      "text": "rgba(224, 224, 255, 1)"
    },
    "tabs": [
      {
        "id": "tab_ms62r3v5_2",
        "label": "初始",
        "style": "text",
        "params": [
          {
            "path": "initial_prompt",
            "label": "初始提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      },
      {
        "id": "tab_ms62r3v5_3",
        "label": "增强后",
        "style": "text",
        "params": [
          {
            "path": "positive_prompt",
            "label": "正向提示词",
            "style": "text",
            "color": {
              "bg": "rgba(0, 0, 0, 0)"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "negative",
    "title": "负向提示词",
    "style": "text",
    "open": true,
    "params": [
      {
        "path": "negative_prompt",
        "label": "负向提示词",
        "style": "text"
      }
    ],
    "color": {
      "bg": "rgba(42, 24, 27, 1)",
      "border": "rgba(239, 68, 68, 0.25)"
    }
  },
  {
    "id": "workflow_nodes",
    "title": "工作流节点",
    "style": "nodes",
    "open": false,
    "params": []
  },
  {
    "id": "extra",
    "title": "附加元数据",
    "style": "flat",
    "open": false,
    "params": [
      {
        "path": "extra.*"
      }
    ],
    "hidden": true
  },
  {
    "id": "raw",
    "title": "原始元数据",
    "style": "raw",
    "open": false,
    "params": [],
    "hidden": true
  }
];
