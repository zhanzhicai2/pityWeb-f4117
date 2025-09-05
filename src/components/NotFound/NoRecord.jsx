import noRecord from '@/assets/no_record.svg';
import {Empty} from "antd";

export default ({desc, height = 180,image = noRecord}) => {
  return <Empty
    image={image}
    imageStyle={{
      height,
    }}
    description={desc || '暂无数据'}
  >
  </Empty>
}
