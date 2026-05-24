import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import styles from "./ReportWeekToolbar.module.css";

/**
 * Presentational year / month / week selectors + back control.
 * All state and API logic stay in the parent.
 */
function ReportWeekToolbar({
  backLabel = "< USERS",
  onBack,
  yearOptions = [],
  monthOptions = [],
  weekOptions = [],
  yearValue,
  monthValue,
  weekValue,
  onYearChange,
  onMonthChange,
  onWeekChange,
  disabled,
}) {
  const monthDisabled = disabled || !yearValue;
  const weekDisabled = disabled || !monthValue;
  const monthPlaceholder =
    monthOptions.length > 0
      ? "--select a month---"
      : yearValue
        ? "No months for this year"
        : "Select a year first";
  const weekPlaceholder =
    weekOptions.length > 0
      ? "--select a day---"
      : monthValue
        ? "No weeks for this month"
        : yearValue
          ? "Select a month first"
          : "Select a year first";

  return (
    <Row className={styles.toolbarRow}>
      <Col md={1} className={styles.toolbarCol}>
        <Form.Label
          onClick={onBack}
          className={styles.backLink}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (typeof onBack === "function") {
                onBack();
              }
            }
          }}
        >
          {backLabel}
        </Form.Label>
      </Col>
      <Col md={{ span: 2, offset: 1 }} className={styles.toolbarCol}>
        <Form.Select
          value={yearValue}
          onChange={onYearChange}
          disabled={disabled}
          className={styles.select}
          aria-label="Report year"
        >
          <option value="" hidden>
            {yearOptions.length > 0 ? "--select a year---" : "No years available"}
          </option>
          {yearOptions.map((y, idx) => (
            <option key={idx} value={y}>
              {y}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={{ span: 2, offset: 1 }} className={styles.toolbarCol}>
        <Form.Select
          value={monthValue}
          onChange={onMonthChange}
          disabled={monthDisabled}
          className={styles.select}
          aria-label="Report month"
        >
          <option value="" hidden>
            {monthPlaceholder}
          </option>
          {monthOptions.map((m, idx) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={{ span: 2, offset: 1 }} className={styles.toolbarCol}>
        <Form.Select
          value={weekValue}
          onChange={onWeekChange}
          disabled={weekDisabled}
          className={styles.select}
          aria-label="Report week"
        >
          <option value="" hidden>
            {weekPlaceholder}
          </option>
          {weekOptions.map((w, idx) => (
            <option key={idx} value={w}>
              {w}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
}

export default ReportWeekToolbar;
