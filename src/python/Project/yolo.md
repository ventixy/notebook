---

order: -15
title:  YOLOv8
shortTitle: yolov8

---


## yolo快速入门

yolov8仓库地址：https://github.com/ultralytics/ultralytics

yolov8官方文档：https://docs.ultralytics.com

### yolov8的安装

使用yolov8需要 python>=3.8 和 PyTorch>=1.8 的环境，参照：[Python常用环境的安装](/python/BasicSyntax/env)

Pip install the ultralytics package including all requirements in a Python>=3.8 environment with PyTorch>=1.8.

```bash
conda create --name yolov8 --clone pytorch
conda activate yolov8

pip install ultralytics
```

YOLOv8 may be used directly in the Command Line Interface (CLI) with a yolo command:
```bash
yolo predict model=yolov8n.pt source='https://ultralytics.com/images/bus.jpg'
```
CLI文档：https://docs.ultralytics.com/usage/cli


### 预训练权重


### python代码示例

YOLOv8 may also be used directly in a Python environment, and accepts the same arguments as in the CLI example above:

```python
from ultralytics import YOLO

# Load a model
model = YOLO("yolov8n.yaml")  # build a new model from scratch
model = YOLO("yolov8n.pt")  # load a pretrained model (recommended for training)

# Use the model
model.train(data="coco128.yaml", epochs=3)  # train the model
metrics = model.val()  # evaluate model performance on the validation set
results = model("https://ultralytics.com/images/bus.jpg")  # predict on an image
path = model.export(format="onnx")  # export the model to ONNX format
```
See YOLOv8 [Python Docs](https://docs.ultralytics.com/usage/python) for more examples.


## 数据集准备

yolov8 官网给出的数据准备流程 --> [Steps to Contribute a New Dataset](https://docs.ultralytics.com/datasets/#steps-to-contribute-a-new-dataset):

1) **Collect Images**: Gather the images that belong to the dataset. These could be collected from various sources, such as public databases or your own collection.

2) **Annotate Images**: Annotate these images with bounding boxes, segments, or keypoints, depending on the task.

3) **Export Annotations**: Convert these annotations into the YOLO *.txt file format which Ultralytics supports.

4) **Organize Dataset**: Arrange your dataset into the correct folder structure. You should have `train/` and `val/` top-level directories, and within each, an `images/` and `labels/` subdirectory.

```txt
dataset/
├── train/
│   ├── images/
│   └── labels/
└── val/
    ├── images/
    └── labels/
```

5) **Create a `data.yaml` File**: In your dataset's root directory, create a data.yaml file that describes the dataset, classes, and other necessary information.

6) **Optimize Images** (Optional): If you want to reduce the size of the dataset for more efficient processing, you can optimize the images using the code below. This is not required, but recommended for smaller dataset sizes and faster download speeds.



### 标注数据集

常用标注工具：

- labelimg 是一种矩形标注工具，常用于目标识别和目标检测，其标记数据输出为.xml和.txt

- labelme 是一种多边形标注工具，可以准确的将轮廓标注出来，常用于分割，其标记输出格式为json

- VGG Image Annotator (VIA)

- CVAT (Computer Vision Annotation Tool)

注意：labelme 生成的标签是 json 文件的格式，后续需要转化成 txt 文件才能被 yolov 使用





### 划分数据集

在目标检测的训练过程中，训练集、验证集和测试集扮演着不同的角色：

- 训练集（Training Set）
  训练集是用于模型训练的数据集。目标检测模型通过对训练集中的图像进行学习和参数优化，来掌握目标的特征和上下文信息。训练集通常包含大量的标注数据，
  其中目标物体被标记为其位置和类别。模型通过观察训练集中的样本来学习目标的外观和形状，以便能够在后续的预测中对新的图像进行目标检测。

- 验证集（Validation Set）
  验证集用于在训练过程中评估模型的性能和调整超参数。它是从与训练集不同的图像中随机选择的一部分数据。通过在验证集上进行评估，可以监控模型的训练过程并调整模型的超参数，
  例如学习率、正则化参数等。验证集上的性能指标可以帮助选择最佳的模型，并防止过拟合。验证集的数据标注也需要包含目标物体的位置和类别信息。

- 测试集（Test Set）
  测试集是用于最终评估训练好的目标检测模型性能的数据集。它是与训练集和验证集完全独立的数据集。测试集中的图像对于模型来说是全新的，模型在这些图像上进行预测并生成目标检测结果。
  测试集的数据标注同样包含目标物体的位置和类别信息。通过与测试集的性能比较，可以得出模型在真实场景中的准确率、召回率、精确率等性能指标，评估模型的泛化能力和实际应用效果。

这三个数据集在目标检测的训练过程中扮演着重要的角色，训练集用于模型的学习和参数优化，验证集用于超参数调优和模型选择，而测试集用于最终评估模型的性能和泛化能力。
它们的目的是确保训练出的模型能够准确地检测出新的图像中的目标物体。


[数据集划分脚本](https://github.com/kuisec/division-of-data/blob/main/DivisionOfData.py)


### 数据集格式转换

在目标检测任务中，常见的数据集格式有三种：**VOC (xml)**、**COCO (json)** 和 **YOLO (txt)** ：

1. **VOC (Visual Object Classes) 数据集**:
    - VOC 数据集最初由英国牛津大学的计算机视觉小组创建，用于目标检测和图像分割任务。
    - 包含20种常见的物体类别，例如人、车、狗、猫等。
    - VOC 数据集由以下五个部分构成：
        - **JPEGImages**：存放训练与测试的所有图片。
        - **Annotations**：存放每张图片打完标签所对应的 XML 文件。
        - **ImageSets**：存放训练集、验证集、测试集等图片的文件名。
        - **SegmentationClass** 与 **SegmentationObject**：存放图像分割结果图，对目标检测任务无用。
    - VOC 数据集的标签以 XML 文件形式存放，包含物体类别、位置信息等。

2. **COCO (Common Objects in Context) 数据集**:
    - 由微软研究院创建，旨在提供更广泛的物体类别和更丰富的场景上下文，促进计算机视觉研究。
    - COCO 数据集包含三种标注类型：
        - **Object Instances**：目标实例。
        - **Object Keypoints**：目标上的关键点。
        - **Image Captions**：看图说话。
    - 使用 JSON 文件存储，包含基本类型：info、image、license。

3. **YOLO (You Only Look Once) 数据集**:
    - YOLO 数据集标注格式主要用于 YOLO 项目, 标签使用 TXT 文本进行保存，每行表示一个目标。
    - YOLO 标注格式示例：
      ```
      <object-class> <x> <y> <width> <height>
      ```
      其中：
        - `<object-class>`：物体类别。
        - `<x>`、`<y>`：目标在图像中的中心坐标（相对于图像宽度和高度的比例）。
        - `<width>`、`<height>`：目标的宽度和高度（相对于图像宽度和高度的比例）。

(1) 目标检测中数据集格式之间的相互转换--coco、voc、yolo - [知乎](https://zhuanlan.zhihu.com/p/461488682).

(2) 目标检测两种常用的数据集COCO和VOC - Tutu007 - [博客园](https://www.cnblogs.com/tully/p/18057834).

(3) 目标检测数据集大全「包含VOC+COCO+YOLO三种格式+划分脚本+训练脚本」- [知乎](https://zhuanlan.zhihu.com/p/679598127).

(4) 目标检测任务中常用的数据集格式(voc、coco、yolo)_voc数据集格式-[CSDN博客](https://blog.csdn.net/weixin_45277161/article/details/130331788).

(5) VOC/COCO/YOLO数据总结及转换 - [知乎专栏](https://zhuanlan.zhihu.com/p/160103709).


[数据集标注文件格式转换脚本](https://github.com/KKKSQJ/DeepLearning/tree/master/others/label_convert)


roboflow 


### 数据集配置

**YOLOv8** 的 **yaml** 配置文件用于定义模型的结构和训练参数，下面是常用参数的解释：

1. **`path`**：指定数据集的路径

2. **`train`**：训练集的图像路径

3. **`val`**：验证集的图像路径

4. **`test`**：测试集的图像路径（这部分是可选的）

5. **`names`**：定义目标类别的名称和对应的索引 

6. **`download`**：用于下载数据集（这部分是可选的）

```yaml
# Train/val/test sets as 1) dir: path/to/imgs, 2) file: path/to/imgs.txt, or 3) list: [path/to/imgs1, path/to/imgs2, ..]
path: ../datasets/coco8  # dataset root dir
train: images/train  # train images (relative to 'path') 
val: images/val  # val images (relative to 'path') 
test:  # test images (optional)

# Classes (80 COCO classes)
names:
  0: person
  1: bicycle
  2: car
  # ...
  77: teddy bear
  78: hair drier
  79: toothbrush
```


## yoloV8目标检测

### 开始训练

```python
from ultralytics import YOLO

if __name__ == '__main__':
    model = YOLO('./models/yolov8n.pt')

    result_path = './result/detect'
    result_name = 'train1'

    model.train(data='datasets/DambV0/DambV0.yaml', epochs=500, batch=64, project=result_path, name=result_name, workers=0)

    model.val()
```


### train方法参数

YOLOv8的`train`方法可以接受多个参数，用于配置训练过程。以下是这些参数的详细说明：

1. **`data`**：指定数据集的配置文件路径。这个配置文件描述了数据集的类别、图像路径、标签等信息

2. **`epochs`**：训练的轮数。这是指模型将遍历整个训练数据集的次数。通常，较大的`epochs`值可以提高模型的性能，但也可能导致过拟合。推荐的常用值为300到1200

3. **`batch`**：每个批次中的图像数量。批量大小影响训练速度和内存需求。较大的批量大小可以加快训练速度，但可能需要更多的内存。推荐的常用值因任务而异，一般在16到64之间

4. **`imgsz`**：训练图像的尺寸。通常，较大的图像尺寸可以提高模型的性能，但也会增加计算成本。推荐的常用值为416、512或640

5. **`device`**：指定训练使用的设备，如GPU或CPU。如果不指定，将自动选择可用的GPU（如果有）；否则将使用CPU

6. **`weights`**：预训练模型的权重文件路径。如果指定了预训练权重，模型将从这些权重开始训练

7. **`multi_scale`**：是否使用多尺度训练。如果设置为True，模型将在不同尺度的图像上进行训练，有助于提高模型的鲁棒性

8. **`augment`**：是否使用数据增强。数据增强可以帮助模型更好地泛化

9. **`cache_images`**：是否缓存图像。如果设置为True，模型将在内存中缓存图像以加快训练速度

10. **`project`** 和 **`name`**：用于指定训练结果的保存路径。`project`表示文件夹名称，`name`表示结果的名称


### 图像检测


