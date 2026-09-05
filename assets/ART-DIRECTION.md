# 地宫造物 · 美术更新

保留原有三项造物、加工操作、科技解锁、存档键与自由工作台。

## 配色与材质

- 黛青 `#173e3e`：漆木导航、图谱底色。
- 石绿 `#52755d`：工作毡、零件连接、科技点亮。
- 绢本 `#f6edcf`：手册、零件匣、弹窗。
- 赭石 `#b88148`：木料的明暗分面。
- 古金 `#cda55f`：描边、轮毂和高光。
- 朱砂 `#a94330`：启动把手、印章。

零件保留实时绘制与互动几何，增加分面光照、木纹、投影、玉色轮毂。场景图只用作背景，不参与拼装判定。

## 原创图像素材

使用内置 image_gen 生成，网页以 WebP 格式加载。未使用现有游戏的角色、标识或界面截图。

`assets/courtyard-v2.webp`：wide 16:9 stylized cel-shaded painterly environment, original Chinese Song-inspired mountain artisan courtyard; teal jade mountains, malachite foliage, pale silken sky, ochre timber veranda at edges, subtle vermilion accent cloth, warm golden sunlight from upper left and dappled leaf shadows. Natural fantasy-adventure feeling reminiscent of Breath of the Wild, original Chinese setting. Panoramic mountains and clouds above, wooden eaves and bamboo at the sides, spacious pale sandstone courtyard kept empty for an interactive workbench overlay. No tables, machinery, people, UI, text, or logos. Crisp cel-shaded shapes with painterly texture, not photographic or sepia monochrome.

`assets/aqiao-v2.webp`：square original young adult Chinese female artisan portrait, waist-up, dark hair bun, jade hairpin, sea-green cross-collar work tunic, ochre apron, small vermilion tie, holding a small wooden mallet by shoulder, clever friendly expression. Same elegant cel-shaded adventure illustration, warm rim sunlight, pale silk background, no text or logos; clear at avatar size.

## 第三版：排版、字体与物品质感

- 布局：全屏场景，顶部轻量导航，左上白色标题，底部透明零件栏；图谱、陈列和加工使用同一黛青界面。
- 字体：本地托管 Noto Serif SC 700 标题子集，正文系统无衬线字体。字体许可证见 `assets/fonts/OFL.txt`。
- 材质：`assets/props-v3.png` 为原创透明 4 × 3 图集。依次为榆木车身、木轮轴、小木轮、大木轮、木支架、提水轮、手摇柄、小水斗、木齿轮、偏心轮、小木槌、铜铃。Canvas 通过独立源区域和装配锚点绘制，不使用截图替代交互。
- 光照：暖色斜向高光，木制切面、凹陷暗部、铜绿与刻纹；工作台增加细木纹及铜饰，整体保留国风山野的青绿和赭金。
- 来源：内置 imagegen 生成图集。显示使用原始素材，未复用现有游戏的物品图。
