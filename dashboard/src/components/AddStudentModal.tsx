import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
} from "antd";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import client from "../api/client";
import { COLORS } from "../constants/colors";
import { PROGRAMS } from "../constants/feedbackConfig";

type AddStudentModalProps = {
  open: boolean;
  closeModal: () => void;
  postSubmission: () => Promise<void>;
};
const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  closeModal,
  postSubmission,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const [username, setUsername] = useState("");
  const [form] = Form.useForm();

  const handleAddFeedbackPeriod = async (values: any) => {
    try {
      setIsLoading(true);
      const allVals = { ...values, role: "student" };
      const backendEndpoint = createUser
        ? `/auth/user_reg`
        : `/dashboard/students/create`;
      await client.post(backendEndpoint, { ...allVals });
    } catch (error) {
      if (error instanceof Error)
        console.log(
          isAxiosError(error) ? error?.response?.data : error?.message,
        );
    } finally {
      form.resetFields();
      setIsLoading(false);
      closeModal();
      await postSubmission();
    }
  };

  const onCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      title="Add New Student"
      onOk={form.submit}
      okButtonProps={{ style: { backgroundColor: COLORS.NAVY } }}
      styles={{
        body: {
          paddingTop: "16px",
          minHeight: "500px",
          alignContent: "center",
        },
      }}
    >
      {isLoading ? (
        <div className="loading-spin">
          <Spin size="large" />
          Loading...
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleAddFeedbackPeriod}>
          <Space
            style={{ justifyContent: "space-between", width: "100%" }}
            styles={{ item: { width: "100%" } }}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input placeholder="firstName" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input placeholder="lastName" />
            </Form.Item>
          </Space>
          <Form.Item name="role" label="Role">
            <Input placeholder="Student" disabled value="student" />
          </Form.Item>
          <Space
            style={{ justifyContent: "space-between", width: "100%" }}
            styles={{ item: { width: "100%" } }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input stuent's email!" },
                {
                  type: "email",
                  message: "Please input a valid email address",
                },
              ]}
            >
              <Input
                placeholder="Enter Student email"
                onBlur={(e) => setUsername(e.target.value.split("@")[0])}
              />
            </Form.Item>
            {createUser && (
              <Form.Item label="User Name">
                <Input disabled value={username} />
              </Form.Item>
            )}
          </Space>
          {createUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input initial Password!" },
              ]}
            >
              <Input placeholder="password" type="password" />
            </Form.Item>
          )}
          <Form.Item name="degree" label="Degree">
            <Select
              options={Object.entries(PROGRAMS).map(([key, val]) => ({
                value: key,
                label: `(${key}) ${val}`,
              }))}
            />
          </Form.Item>
          <Space
            style={{ justifyContent: "space-between", width: "100%" }}
            styles={{ item: { width: "100%" } }}
          >
            <Form.Item name="year" label="Year">
              <InputNumber min={new Date().getFullYear()} placeholder="year" />
            </Form.Item>
            <Form.Item
              name="studentid"
              label="Student ID"
              rules={[{ required: true, message: "Please input StudentId!" }]}
            >
              <Input placeholder="e.g. BA0013348" />
            </Form.Item>
          </Space>
          <Form.Item>
            <Checkbox onChange={(e) => setCreateUser(e.target.checked)}>
              Also Create New User
            </Checkbox>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddStudentModal;
