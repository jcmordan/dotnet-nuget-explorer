import * as React from "react";
import { Package } from "../App";
import { Card, Avatar, Button, Table } from "antd";
import Meta from "antd/lib/card/Meta";

const columns = [
 
    {
        title: 'Name',
        dataIndex: 'version',
        key: 'name'
      },
      {
        title: 'Dowloads',
        dataIndex: 'downloads',
        key: 'download'
      }
   ]

interface Props {
    packageDetail: undefined | Package;
}

export default class PackageDetails extends React.Component<Props> {
    public render() {
        const { packageDetail } = this.props;
        //const { Option } = Select;

        if (packageDetail) {

          //  const options = packageDetail.versions.map(d => <Option key={d.version}>{d.version}</Option>);
            return (

                <>
                    <Card
                        extra={'By ' + packageDetail.authors.join(",")}>
                        <Button type="primary" style={{ float: "right" }} icon="download" size={"large"}>
                            Download
                        </Button>
                        <Meta

                            avatar={<Avatar size={80} src={packageDetail.iconUrl} />}
                            title={packageDetail.id + ' ' + packageDetail.version}
                            description={packageDetail.summary || packageDetail.description}
                        />

                        <p></p>
                        <Card type="inner">
                        <h4 style={{ fontWeight: 600, fontSize: 16 }}>Versions</h4>
                        <Table columns={columns} dataSource={packageDetail.versions}></Table>

                            {/* <label style={{ fontWeight: 600, fontSize: 16 }}>Versions</label>
                            <Select style={{ width: 140, paddingLeft: 10 }}
                                defaultValue={packageDetail.versions[0].version} >
                                {options}
                            </Select> */}
                        </Card>
                    </Card>
                </>
            );
        } else {
            return (
                <div> Details</div>
            );
        }


    }
}