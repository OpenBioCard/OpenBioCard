#!/bin/bash

# 批量替换颜色变量脚本
# 此脚本用于将所有 Vue 组件中的硬编码颜色替换为 CSS 变量

COMPONENTS_DIR="/Users/gudupao/Desktop/OpenBioCard/packages/worker/src/frontend/components"

# 颜色映射
declare -A color_map=(
    # 背景色
    ["#ffffff"]="var(--color-bg-primary)"
    ["#fff"]="var(--color-bg-primary)"
    ["#f9fafb"]="var(--color-bg-secondary)"
    ["#f3f4f6"]="var(--color-bg-tertiary)"
    ["rgba(255, 255, 255, 0.8)"]="var(--color-bg-overlay)"
    ["rgba(255, 255, 255, 0.7)"]="var(--color-bg-overlay)"

    # 文本颜色
    ["#111827"]="var(--color-text-primary)"
    ["#000000"]="var(--color-primary)"
    ["#4a5568"]="var(--color-text-secondary)"
    ["#374151"]="var(--color-text-secondary)"
    ["#6b7280"]="var(--color-text-tertiary)"
    ["#9ca3af"]="var(--color-text-tertiary)"

    # 边框颜色
    ["#e5e7eb"]="var(--color-border-primary)"
    ["#d1d5db"]="var(--color-border-secondary)"
    ["rgba(229, 231, 235, 0.8)"]="var(--color-border-tertiary)"

    # 阴影
    ["0 1px 3px rgba(0, 0, 0, 0.1)"]="var(--shadow-sm)"
    ["0 4px 6px rgba(0, 0, 0, 0.1)"]="var(--shadow-md)"
    ["0 0 0 3px rgba(0, 0, 0, 0.1)"]="var(--shadow-focus)"
)

echo "正在批量替换颜色变量..."
echo ""

# 遍历所有需要更新的文件
for file in \
    "$COMPONENTS_DIR/GalleryList.vue" \
    "$COMPONENTS_DIR/GalleryEdit.vue" \
    "$COMPONENTS_DIR/ContactEdit.vue" \
    "$COMPONENTS_DIR/SocialLinksEdit.vue" \
    "$COMPONENTS_DIR/ProjectsEdit.vue" \
    "$COMPONENTS_DIR/QRCodeModal.vue"
do
    if [ -f "$file" ]; then
        echo "处理: $file"

        # 执行替换
        for color in "${!color_map[@]}"; do
            var="${color_map[$color]}"
            sed -i '' "s|${color}|${var}|g" "$file" 2>/dev/null || true
        done

        echo "  ✓ 完成"
    else
        echo "  ✗ 文件不存在: $file"
    fi
done

echo ""
echo "批量替换完成！"
